
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface QuizTopic {
  name: string;
  difficulties: string[];
}

interface QuizQuestion {
  id: number;
  category: string;
  difficulty?: string;
  question: string;
  options: string[];
}

interface QuizResult {
  totalQuestions: number;
  score: number;
  percentage: number;
  message: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  private apiUrl = 'http://localhost:3000/api';

  topics: QuizTopic[] = [];
  difficulties: string[] = ['Easy', 'Medium', 'Hard'];
  questionCounts: number[] = [5, 10, 20];

  selectedTopic = 'JavaScript';
  selectedDifficulty = 'Easy';
  selectedCount = 5;

  quizStarted = false;
  questions: QuizQuestion[] = [];
  selectedAnswers: { [key: number]: number } = {};
  currentIndex = 0;
  result: QuizResult | null = null;
  loading = false;
  error = '';
  timeLeft = 120;
  timer: ReturnType<typeof setInterval> | undefined;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTopics();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  get currentQuestion(): QuizQuestion | undefined {
    return this.questions[this.currentIndex];
  }

  get progress(): number {
    return this.questions.length
      ? ((this.currentIndex + 1) / this.questions.length) * 100
      : 0;
  }

  get answeredCount(): number {
    return Object.keys(this.selectedAnswers).length;
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  loadTopics(): void {
    this.loading = true;
    this.http.get<QuizTopic[]>(`${this.apiUrl}/topics`).subscribe({
      next: (data) => {
        this.topics = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Could not load topics:', err);
        this.loading = false;
        this.error = 'Could not connect to the backend. Make sure it is running on port 3000.';
        this.cdr.detectChanges();
      }
    });

    this.http.get<string[]>(`${this.apiUrl}/difficulties`).subscribe({
      next: (data) => {
        this.difficulties = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Could not load difficulties:', err)
    });
  }

  startQuiz(): void {
    this.stopTimer();
    this.loading = true;
    this.error = '';
    this.result = null;
    this.questions = [];
    this.selectedAnswers = {};
    this.currentIndex = 0;
    this.quizStarted = false;
    this.timeLeft = this.selectedCount * 24;

    const url =
      `${this.apiUrl}/questions?topic=${encodeURIComponent(this.selectedTopic)}` +
      `&difficulty=${encodeURIComponent(this.selectedDifficulty)}` +
      `&count=${this.selectedCount}`;

    this.http.get<QuizQuestion[]>(url).subscribe({
      next: (data) => {
        this.questions = data;
        this.loading = false;

        if (data.length > 0) {
          this.quizStarted = true;
          this.startTimer();
        } else {
          this.error = 'No questions are available for this selection.';
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Could not load questions:', err);
        this.loading = false;
        this.error = 'Could not load questions. Please check that the backend is running.';
        this.cdr.detectChanges();
      }
    });
  }

  selectAnswer(optionIndex: number): void {
    if (!this.result) {
      this.selectedAnswers[this.currentIndex] = optionIndex;
    }
  }

  nextQuestion(): void {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    } else {
      this.submitQuiz();
    }
  }

  previousQuestion(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  submitQuiz(): void {
    if (this.result || this.questions.length === 0 || this.loading) {
      return;
    }

    this.stopTimer();
    this.loading = true;

    const answers = this.questions.map(
      (_, index) => this.selectedAnswers[index] ?? -1
    );

    this.http.post<QuizResult>(`${this.apiUrl}/submit`, {
      answers,
      topic: this.selectedTopic,
      difficulty: this.selectedDifficulty,
      count: this.selectedCount
    }).subscribe({
      next: (data) => {
        this.result = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Could not submit quiz:', err);
        this.error = 'Could not submit your quiz. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  restartQuiz(): void {
    this.stopTimer();
    this.quizStarted = false;
    this.questions = [];
    this.selectedAnswers = {};
    this.currentIndex = 0;
    this.result = null;
    this.error = '';
    this.loading = false;
    this.timeLeft = this.selectedCount * 24;
    this.cdr.detectChanges();
  }

  private startTimer(): void {
    this.stopTimer();

    this.timer = setInterval(() => {
      if (this.timeLeft > 0 && !this.result) {
        this.timeLeft--;
      } else if (this.timeLeft === 0 && !this.result && !this.loading) {
        this.submitQuiz();
      }

      this.cdr.detectChanges();
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}

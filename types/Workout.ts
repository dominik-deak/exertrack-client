import { ExercisePerformed } from './Exercise';

export type Workout = {
	id: string;
	user: string;
	template: string;
	duration: number;
	date: string;
	exercises: ExercisePerformed[];
};

// export type Workout = {
// 	id: string;
// 	user: string;
// 	template: string | null;
// 	duration: number;
// 	date: Date;
// 	exercises: ExercisePerformed[];
// };

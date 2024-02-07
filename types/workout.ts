import { ExercisePerformed } from './exercise';

export default interface Workout {
	id: string;
	user: string;
	template: string;
	duration: number;
	date: string;
	exercises: ExercisePerformed[];
}

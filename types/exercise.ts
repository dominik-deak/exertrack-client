export interface ExerciseSet {
	reps: number;
	weight: number;
}

export interface ExercisePerformed {
	name: string;
	bodypart: string;
	sets: ExerciseSet[];
}

export default interface Exercise {
	id: string;
	name: string;
	bodypart: string;
	type: string;
	user: null;
	created: string;
	updated: string;
}

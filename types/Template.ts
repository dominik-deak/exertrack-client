export type Template = {
	id: string;
	name: string;
	user: string | null;
	created: Date;
	updated: Date;
	exercises: ExerciseToPerform[];
};

export type ExerciseToPerform = {
	id: string;
	sets: number;
	repsMin: number;
	repsMax: number;
};

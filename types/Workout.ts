export type Workout = {
	id: string;
	userId: string;
	templateId: string | null;
	templateName: string | null; // added by the server for convenience
	duration: number;
	created: Date;
	updated: Date;
	exercises: WorkoutExercise[];
};

export type WorkoutExercise = {
	id: string;
	name: string;
	bodypart: string;
	type: string;
	userId: string | null;
	created: Date;
	updated: Date;
	sets: ExerciseSet[];
	prediction?: string | null;
	previousWeight?: number | null;
	previousReps?: number | null;
};

export type ExerciseSet = {
	weight: number;
	reps: number;
};

export type WorkoutSubmission = {
	templateId: string | null;
	duration: number; // minutes
	exercises: WorkoutExercise[];
};

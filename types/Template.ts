export type Template = {
	id: string;
	name: string;
	userId: string | null;
	created: Date;
	updated: Date;
	exercises: TemplateExercise[];
};

export type TemplateExercise = {
	id: string;
	sets: number;
	repsMin: number;
	repsMax: number;
	name: string;
	bodypart: string;
	type: string;
	userId: string | null;
	created: Date;
	updated: Date;
	prediction?: string;
	previousWeight?: number | null;
	previousReps?: number | null;
};

export type TemplateSubmission = {
	name: string;
	exercises: TemplateExercise[];
};

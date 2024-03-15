export type Exercise = {
	id: string;
	name: string;
	bodypart: string;
	type: string;
	user: null;
	created: string;
	updated: string;
};

export type ExercisePerformed = {
	name: string;
	bodypart: string;
	sets: ExerciseSet[];
};

export type ExerciseSet = {
	reps: number;
	weight: number;
};

// export type Exercise = {
// 	id: string;
// 	name: string;
// 	bodypart: string;
// 	type: string;
// 	user: string | null;
// 	created: Date | null;
// 	updated: Date | null;
// };

// export type ExercisePerformed = {
// 	id: string;
// 	sets: ExerciseSet[];
// };

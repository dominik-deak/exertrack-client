export type SplitUsageItem = {
	templateName: string | null;
	count: number;
};

export type SplitUsageData = {
	name: string;
	used: number;
	color: string;
	legendFontColor: string;
	legendFontSize: number;
}[];

export type VolumeItem = {
	date: Date;
	volume: number;
};

export type VolumeData = {
	labels: string[];
	datasets: [
		{
			data: number[];
		}
	];
};

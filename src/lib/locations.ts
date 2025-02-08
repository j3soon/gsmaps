export const locations: {
	id: number;
	name: string;
	description: string;
	gmapsUrl: string;
	bbPosition: [number, number, number];
	bbRotation: [number, number, number];
	bbSize: [number, number, number];
	labelPosition: [number, number, number];
	viewPosition?: [number, number, number];
	category: string;
}[] = [
	{
		id: 2,
		name: 'Shui Mu Student Center',
		description:
			"The 1st-floor restaurant area offers a diverse selection of delicious food options and occasional pop-up stalls. Additionally, there are Shui Mu Department Store, the NTHU Optical Shop, and the Laundry Room, providing convenient lifestyle services. On the 2nd floor, you'll find Malacca Malaysian Cuisine, Punda Coffee, a hair salon, and the Lijie Typing and Copying Service.",
		gmapsUrl: 'https://goo.gl/maps/6H5vBBmfezozYtbf7',
		bbPosition: [-17.5, -2, 11],
		bbRotation: [0, 0.225, 0],
		bbSize: [4.5, 3, 16],
		labelPosition: [-17.5, 1, 11],
		category: 'Campus Canteen',
	},
	{
		id: 1,
		name: 'XCB Food Court',
		description:
			"The XiaoChiBu includes a total of 10 food stalls, a 7-11 convenience store, and a McDonald's, offering a diverse selection for faculty, staff, and students. The food stalls consist of the following: Ruis Rice Balls, Hansik Fusion Cuisine, Duowei, Yifan Fast Food, Pinjia Japanese Cuisine, Tianyi Kitchen, Fenghe Triple Delight, and Jia Ming Fresh Fruit Tea.",
		gmapsUrl: 'https://goo.gl/maps/nsCnxDtBtgrFT4Vq8',
		bbPosition: [-21, -2, -8],
		bbRotation: [0, -0.715, 0],
		bbSize: [5, 2, 7],
		labelPosition: [-21, 1, -8],
		viewPosition: [-10, 3, -8],
		category: 'Campus Canteen',
	},
	{
		id: 11,
		name: 'General Building I',
		description:
			"The 1st-floor restaurant area offers a diverse selection of delicious food options and occasional pop-up stalls. Additionally, there are Shui Mu Department Store, the NTHU Optical Shop, and the Laundry Room, providing convenient lifestyle services. On the 2nd floor, you'll find Malacca Malaysian Cuisine, Punda Coffee, a hair salon, and the Lijie Typing and Copying Service.",
		gmapsUrl: '',
		bbPosition: [0, 0, 0],
		bbRotation: [0, 0, 0],
		bbSize: [2, 2, 2],
		labelPosition: [0, 0, 0],
		category: 'General Buildings',
	},
	{
		id: 12,
		name: 'General Building II',
		description:
			"The XiaoChiBu includes a total of 10 food stalls, a 7-11 convenience store, and a McDonald's, offering a diverse selection for faculty, staff, and students. The food stalls consist of the following: Ruis Rice Balls, Hansik Fusion Cuisine, Duowei, Yifan Fast Food, Pinjia Japanese Cuisine, Tianyi Kitchen, Fenghe Triple Delight, and Jia Ming Fresh Fruit Tea.",
		gmapsUrl: '',
		bbPosition: [0, 0, 0],
		bbRotation: [0, 0, 0],
		bbSize: [2, 2, 2],
		labelPosition: [0, 0, 0],
		category: 'General Buildings',
	},
];

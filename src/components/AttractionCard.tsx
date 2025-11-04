interface Props {
	imageUrl: string;
	name: string;
}

function AttractionCard(props: Props) {
	const {imageUrl, name} = props;

	return (
		<div className="w-64 rounded-lg shadow-lg overflow-hidden bg-brand-light m-2">
			{/* Image: Fills the width, fixed height, and crops to fit */}
			<img
				src={imageUrl}
				alt={name}
				className="w-full h-48 object-cover"
			/>

			{/* Name: Centered, padded, and uses your brand's secondary color */}
			<div className="p-4">
				<h3 className="text-xl font-semibold text-brand-secondary text-center">
					{name}
				</h3>
			</div>
		</div>
	);
}

export default AttractionCard;

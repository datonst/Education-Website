import SeriesItem from './SeriesItem';

/**
 * Component hiển thị danh sách các series
 */
const SeriesList = ({
    series,
    onDeleteClick,
    onEditClick,
    onPublishClick,
    noItemsComponent
}) => {
    if (series.length === 0) {
        return noItemsComponent;
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {series.map(item => (
                <SeriesItem
                    key={item._id}
                    series={item}
                    onDeleteClick={onDeleteClick}
                    onEditClick={onEditClick}
                    onPublishClick={onPublishClick}
                />
            ))}
        </div>
    );
};

export default SeriesList;

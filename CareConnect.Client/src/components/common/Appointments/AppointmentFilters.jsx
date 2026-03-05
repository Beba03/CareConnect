export default function AppointmentFilters({ filters, onFilterChange, totalCount, filteredCount }) {
    const handleStatusChange = (e) => {
        onFilterChange({
            ...filters,
            status: e.target.value
        });
    };

    const handleTimeframeChange = (e) => {
        onFilterChange({
            ...filters,
            timeframe: e.target.value
        });
    };

    return (
        <div className="card mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Status Filter */}
                    <div>
                        <label className="label text-xs mb-1">Status</label>
                        <select
                            value={filters.status}
                            onChange={handleStatusChange}
                            className="input-field py-2 text-sm"
                        >
                            <option value="all">All Statuses</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="NoShow">No Show</option>
                        </select>
                    </div>

                    {/* Timeframe Filter */}
                    <div>
                        <label className="label text-xs mb-1">Timeframe</label>
                        <select
                            value={filters.timeframe}
                            onChange={handleTimeframeChange}
                            className="input-field py-2 text-sm"
                        >
                            <option value="all">All Time</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="today">Today</option>
                            <option value="past">Past</option>
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{filteredCount}</span> of{' '}
                    <span className="font-semibold">{totalCount}</span> appointments
                </div>
            </div>
        </div>
    );
}
import { Search } from 'lucide-react';

export default function RecordFilters({ filters, onFilterChange, totalCount, filteredCount }) {
    const handleTypeChange = (e) => {
        onFilterChange({
            ...filters,
            recordType: e.target.value
        });
    };

    const handleSearchChange = (e) => {
        onFilterChange({
            ...filters,
            searchTerm: e.target.value
        });
    };

    return (
        <div className="card mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 flex-1">
                    {/* Record Type Filter */}
                    <div>
                        <label className="label text-xs mb-1">Record Type</label>
                        <select
                            value={filters.recordType}
                            onChange={handleTypeChange}
                            className="input-field py-2 text-sm"
                        >
                            <option value="all">All Types</option>
                            <option value="Consultation">Consultation</option>
                            <option value="LabResult">Lab Result</option>
                            <option value="Prescription">Prescription</option>
                            <option value="Diagnosis">Diagnosis</option>
                            <option value="Imaging">Imaging</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="label text-xs mb-1">Search</label>
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
                                size={18}
                            />
                            <input
                                type="text"
                                value={filters.searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search records..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-600 whitespace-nowrap">
                    Showing <span className="font-semibold">{filteredCount}</span> of{' '}
                    <span className="font-semibold">{totalCount}</span> records
                </div>
            </div>
        </div>
    );
}
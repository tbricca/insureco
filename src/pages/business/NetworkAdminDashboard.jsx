import React, { useState } from 'react';
import {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Pagination,
  Search,
  InlineNotification,
  Tag,
} from '@carbon/react';
import { AreaChart, GaugeChart } from '@carbon/charts-react';
import { Launch } from '@carbon/icons-react';
import '@carbon/charts/styles.css';
import './NetworkAdminDashboard.scss';

const areaChartData = [
  { group: 'Network Traffic', date: new Date('2024-01-01').getTime(), value: 65 },
  { group: 'Network Traffic', date: new Date('2024-01-02').getTime(), value: 29 },
  { group: 'Network Traffic', date: new Date('2024-01-03').getTime(), value: 72 },
  { group: 'Network Traffic', date: new Date('2024-01-04').getTime(), value: 85 },
  { group: 'Network Traffic', date: new Date('2024-01-05').getTime(), value: 40 },
  { group: 'Network Traffic', date: new Date('2024-01-06').getTime(), value: 38 },
  { group: 'Network Traffic', date: new Date('2024-01-07').getTime(), value: 78 },
  { group: 'Network Traffic', date: new Date('2024-01-08').getTime(), value: 90 },
  { group: 'Network Traffic', date: new Date('2024-01-09').getTime(), value: 55 },
  { group: 'Network Traffic', date: new Date('2024-01-10').getTime(), value: 20 },
];

const areaChartOptions = {
  title: 'Network Traffic',
  axes: {
    left: { title: 'Info', mapsTo: 'value' },
    bottom: { title: 'Info', mapsTo: 'date', scaleType: 'time' },
  },
  curve: 'curveNatural',
  height: '300px',
  color: { scale: { 'Network Traffic': '#6929C4' } },
  legend: { enabled: true },
};

const gaugeChartData = [
  { group: 'value', value: 42 },
  { group: 'delta', value: -13.37 },
];

const gaugeChartOptions = {
  title: 'Credit Usage',
  resizable: true,
  height: '300px',
  gauge: { type: 'semi', status: 'danger' },
  color: { scale: { value: '#6929C4' } },
  legend: { enabled: false },
};

const deviceHeaders = [
  { key: 'name', header: 'Device Name' },
  { key: 'type', header: 'Type' },
  { key: 'ip', header: 'IP Address' },
  { key: 'mac', header: 'MAC Address' },
  { key: 'status', header: 'Status' },
  { key: 'os', header: 'OS' },
  { key: 'lastSeen', header: 'Last Seen' },
  { key: 'location', header: 'Location' },
];

const deviceRows = [
  { id: '1', name: 'Router-Main', type: 'Router', ip: '192.168.1.1', mac: 'AA:BB:CC:DD:EE:01', status: 'Online', os: 'RouterOS', lastSeen: '2024-01-10 09:00', location: 'Main Office' },
  { id: '2', name: 'Switch-01', type: 'Switch', ip: '192.168.1.2', mac: 'AA:BB:CC:DD:EE:02', status: 'Online', os: 'SwitchOS', lastSeen: '2024-01-10 09:00', location: 'Server Room' },
  { id: '3', name: 'Workstation-A', type: 'PC', ip: '192.168.1.10', mac: 'AA:BB:CC:DD:EE:03', status: 'Online', os: 'Windows 11', lastSeen: '2024-01-10 08:55', location: 'Floor 1' },
  { id: '4', name: 'Laptop-B', type: 'Laptop', ip: '192.168.1.11', mac: 'AA:BB:CC:DD:EE:04', status: 'Offline', os: 'macOS 14', lastSeen: '2024-01-09 17:30', location: 'Floor 2' },
  { id: '5', name: 'Printer-01', type: 'Printer', ip: '192.168.1.20', mac: 'AA:BB:CC:DD:EE:05', status: 'Online', os: 'Firmware', lastSeen: '2024-01-10 08:00', location: 'Reception' },
];

export default function NetworkAdminDashboard() {
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredRows = deviceRows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  return (
    <div className="network-admin-dashboard">
      {/* Page Header */}
      <div className="page-header">
        <Breadcrumb noTrailingSlash>
          <BreadcrumbItem href="#">Service</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>Administrative Dashboard</BreadcrumbItem>
        </Breadcrumb>

        <div className="header-title-row">
          <div className="header-text">
            <h1 className="page-title">Network Adminstration Dashboard</h1>
            <p className="page-description">Network Traffic, Credit Usage, and Your Devices</p>
          </div>
          <Button kind="primary" renderIcon={Launch} className="refresh-btn">
            Refresh Data
          </Button>
        </div>

        <div className="header-controls">
          <div className="search-wrapper">
            <Search
              placeholder="Placeholder"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              labelText="Search devices"
              size="md"
            />
          </div>
          {/* Carbon Pagination used as a top-level page navigator */}
          <div className="header-pagination">
            <Pagination
              totalItems={50}
              pageSize={10}
              pageSizes={[10]}
              page={currentPage}
              onChange={({ page }) => setCurrentPage(page)}
              itemsPerPageText=""
              pageRangeText={() => ''}
              itemRangeText={() => ''}
              backwardText="Previous page"
              forwardText="Next page"
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Warning Banner — Carbon InlineNotification */}
      {!warningDismissed && (
        <div className="notification-wrapper">
          <InlineNotification
            kind="warning"
            lowContrast
            title=""
            subtitle="This is a warning message"
            onCloseButtonClick={() => setWarningDismissed(true)}
            aria-label="Dismiss warning notification"
            statusIconDescription="warning"
          />
        </div>
      )}

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <AreaChart data={areaChartData} options={areaChartOptions} />
        </div>
        <div className="chart-card">
          <GaugeChart data={gaugeChartData} options={gaugeChartOptions} />
        </div>
      </div>

      {/* My Devices Section */}
      <div className="devices-section">
        <div className="devices-header">
          <div className="devices-title-group">
            <h2 className="devices-title">My Devices</h2>
            <p className="devices-description">Devices on your local network</p>
          </div>
          <Button kind="primary" renderIcon={Launch} className="add-device-btn">
            Add Device
          </Button>
        </div>

        <DataTable rows={filteredRows} headers={deviceHeaders}>
          {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getTableContainerProps }) => (
            <TableContainer
              title="Title"
              description="Description"
              {...getTableContainerProps()}
            >
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => {
                      const { key, ...headerProps } = getHeaderProps({ header });
                      return (
                        <TableHeader key={key} {...headerProps}>
                          {header.header}
                        </TableHeader>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    const { key, ...rowProps } = getRowProps({ row });
                    return (
                      <TableRow key={key} {...rowProps}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.info.header === 'status' ? (
                              <Tag
                                type={cell.value === 'Online' ? 'green' : 'red'}
                                size="sm"
                              >
                                {cell.value}
                              </Tag>
                            ) : (
                              cell.value
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>

        <Pagination
          totalItems={filteredRows.length}
          pageSize={pageSize}
          pageSizes={[10, 20, 50]}
          page={currentPage}
          onChange={({ page, pageSize: ps }) => {
            setCurrentPage(page);
            setPageSize(ps);
          }}
        />
      </div>
    </div>
  );
}

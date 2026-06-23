import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tag,
  Button,
} from '@carbon/react';
import { ArrowRight } from '@carbon/icons-react';
import { getAssetDetailPath } from '../../utils/financialAnalytics';
import { formatCurrency, formatDate, getStatusTagType } from '../../utils/businessHelpers';
import './IfadLedger.scss';

const HEADERS = [
  { key: 'name', header: 'Asset ID / Name' },
  { key: 'category', header: 'Category' },
  { key: 'premiumDue', header: 'Premium Due' },
  { key: 'dueDate', header: 'Due Date' },
  { key: 'totalClaims', header: 'Total Claims' },
  { key: 'status', header: 'Status' },
];

/**
 * IfadLedger - Sortable Asset Performance Ledger.
 * Numeric and date values are stored raw so Carbon sorts them correctly
 * (e.g. "Highest Claims" or earliest "Due Date") and are formatted on render.
 * Clicking a row drills down to the asset detail view.
 *
 * @param {Array} assets - Output of getAssetLedger()
 */
export default function IfadLedger({ assets }) {
  const navigate = useNavigate();

  const rows = assets.map((a) => ({
    id: a.id,
    name: a.name,
    category: a.category,
    premiumDue: a.premiumDue,
    dueDate: a.dueDate,
    totalClaims: a.totalClaims,
    status: a.status,
  }));

  const renderCell = (cell) => {
    switch (cell.info.header) {
      case 'premiumDue':
        return formatCurrency(cell.value);
      case 'totalClaims':
        return (
          <span className={cell.value > 0 ? 'ifad-ledger__claims' : undefined}>
            {formatCurrency(cell.value)}
          </span>
        );
      case 'dueDate':
        return formatDate(cell.value, 'long');
      case 'category':
        return (
          <Tag type={cell.value === 'Auto' ? 'blue' : 'red'} size="sm">
            {cell.value}
          </Tag>
        );
      case 'status':
        return <Tag type={getStatusTagType(cell.value, 'asset')} size="sm">{cell.value}</Tag>;
      default:
        return cell.value;
    }
  };

  return (
    <div className="ifad-ledger">
      <DataTable rows={rows} headers={HEADERS} isSortable>
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getTableProps,
          getToolbarProps,
          onInputChange,
          getTableContainerProps,
        }) => (
          <TableContainer {...getTableContainerProps()}>
            <TableToolbar {...getToolbarProps()}>
              <TableToolbarContent>
                <TableToolbarSearch
                  placeholder="Search assets"
                  persistent
                  onChange={onInputChange}
                />
              </TableToolbarContent>
            </TableToolbar>
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
                  <TableHeader aria-label="Drill down" />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  const { key, ...rowProps } = getRowProps({ row });
                  return (
                    <TableRow
                      key={key}
                      {...rowProps}
                      className="ifad-ledger__row"
                      onClick={() => navigate(getAssetDetailPath(row.id))}
                    >
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{renderCell(cell)}</TableCell>
                      ))}
                      <TableCell>
                        <Button
                          kind="ghost"
                          size="sm"
                          hasIconOnly
                          renderIcon={ArrowRight}
                          iconDescription="View asset details"
                          tooltipPosition="left"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(getAssetDetailPath(row.id));
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
}

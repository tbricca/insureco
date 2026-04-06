import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Tile,
  Heading,
  Tag,
  Button,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
} from '@carbon/react';
import {
  ArrowLeft,
  Building,
  CarFront,
  Document,
  Camera,
  Warning,
  CheckmarkFilled,
  ErrorFilled,
} from '@carbon/icons-react';
import {
  mockProperties,
  mockVehicles,
  mockBusinessClaims,
} from '../../data/businessMockData';
import {
  formatCurrencyFull,
  formatDate,
  getRiskLevel,
} from '../../data/financialDashboardData';
import './AssetDetailView.scss';

function getAssetData(assetId) {
  const prop = mockProperties.find(p => p.id === assetId);
  if (prop) return { asset: prop, type: 'Property' };
  const veh = mockVehicles.find(v => v.id === assetId);
  if (veh) return { asset: veh, type: 'Auto' };
  return null;
}

function getClaimsForAsset(assetId) {
  return mockBusinessClaims.filter(c => c.assetId === assetId);
}

const claimHeaders = [
  { key: 'id', header: 'Claim ID' },
  { key: 'claimType', header: 'Type' },
  { key: 'incidentDate', header: 'Incident Date' },
  { key: 'status', header: 'Status' },
  { key: 'claimAmount', header: 'Claim Amount' },
  { key: 'approvedAmount', header: 'Approved' },
];

function StatusTag({ status }) {
  const map = {
    'Paid': 'green',
    'Approved': 'teal',
    'In Review': 'blue',
    'Denied': 'red',
    'Cancelled': 'gray',
  };
  return <Tag type={map[status] || 'gray'} size="sm">{status}</Tag>;
}

function RiskBadge({ ratio }) {
  const risk = getRiskLevel(ratio);
  const icons = {
    High: <ErrorFilled size={14} />,
    Medium: <Warning size={14} />,
    Low: <CheckmarkFilled size={14} />,
  };
  const classes = { High: 'risk-high', Medium: 'risk-medium', Low: 'risk-low' };
  return (
    <span className={`asset-risk-badge ${classes[risk]}`}>
      {icons[risk]} {risk} Risk
    </span>
  );
}

export default function AssetDetailView() {
  const { assetId } = useParams();
  const navigate = useNavigate();

  const result = getAssetData(assetId);
  if (!result) {
    return (
      <div className="asset-detail-not-found">
        <p>Asset not found.</p>
        <Button kind="ghost" renderIcon={ArrowLeft} onClick={() => navigate(-1)}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const { asset, type } = result;
  const claims = getClaimsForAsset(assetId);
  const totalClaimed = claims.reduce((s, c) => s + c.claimAmount, 0);
  const approvedTotal = claims.reduce((s, c) => s + (c.approvedAmount || 0), 0);
  const premiumYearly = type === 'Property' ? asset.yearlyPremium : asset.yearlyPremium;
  const lossRatio = premiumYearly > 0 ? ((totalClaimed / premiumYearly) * 100) : 0;

  const assetName = type === 'Property'
    ? asset.name
    : `${asset.year} ${asset.make} ${asset.model}`;

  const claimRows = claims.map(c => ({
    id: c.id,
    claimType: c.claimType,
    incidentDate: formatDate(c.incidentDate),
    status: c.status,
    claimAmount: formatCurrencyFull(c.claimAmount),
    approvedAmount: c.approvedAmount ? formatCurrencyFull(c.approvedAmount) : '—',
  }));

  return (
    <div className="asset-detail">
      {/* Back Navigation */}
      <div className="asset-detail-nav">
        <Button kind="ghost" renderIcon={ArrowLeft} size="sm" onClick={() => navigate(-1)}>
          Back to Dashboard
        </Button>
      </div>

      <Grid fullWidth>
        {/* Asset Header */}
        <Column lg={16} md={8} sm={4} className="asset-detail-header">
          <div className="asset-header-row">
            <div className="asset-header-icon">
              {type === 'Property' ? <Building size={32} /> : <CarFront size={32} />}
            </div>
            <div className="asset-header-info">
              <div className="asset-header-tags">
                <Tag type={type === 'Property' ? 'teal' : 'blue'} size="sm">
                  {type === 'Property' ? <Building size={12} /> : <CarFront size={12} />}
                  &nbsp;{type}
                </Tag>
                <Tag type={asset.status === 'Active' ? 'green' : 'blue'} size="sm">
                  {asset.status}
                </Tag>
                <RiskBadge ratio={lossRatio} />
              </div>
              <Heading className="asset-name">{assetName}</Heading>
              <p className="asset-id-text">Asset ID: {asset.id}</p>
            </div>
          </div>
        </Column>

        {/* Key Stats */}
        <Column lg={4} md={4} sm={4}>
          <Tile className="asset-stat-tile">
            <p className="asset-stat-label">Annual Premium</p>
            <p className="asset-stat-value">{formatCurrencyFull(premiumYearly)}</p>
            <p className="asset-stat-sub">{formatCurrencyFull(asset.monthlyPremium)}/month</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile className="asset-stat-tile asset-stat-tile--claims">
            <p className="asset-stat-label">Total Claims</p>
            <p className="asset-stat-value">{formatCurrencyFull(totalClaimed)}</p>
            <p className="asset-stat-sub">{claims.length} claim{claims.length !== 1 ? 's' : ''} filed</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile className="asset-stat-tile">
            <p className="asset-stat-label">Total Approved</p>
            <p className="asset-stat-value">{formatCurrencyFull(approvedTotal)}</p>
            <p className="asset-stat-sub">
              {claims.filter(c => c.status === 'In Review').length > 0
                ? `${claims.filter(c => c.status === 'In Review').length} pending review`
                : 'All resolved'}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile className="asset-stat-tile">
            <p className="asset-stat-label">Loss Ratio</p>
            <p className="asset-stat-value">{lossRatio.toFixed(1)}%</p>
            <div className="asset-ratio-bar-wrap">
              <div className="asset-ratio-bar" style={{ width: `${Math.min(lossRatio, 100)}%` }} />
            </div>
          </Tile>
        </Column>

        {/* Policy / Coverage Details */}
        <Column lg={8} md={4} sm={4}>
          <Tile className="asset-info-tile">
            <div className="asset-info-title-row">
              <Document size={20} />
              <Heading className="asset-info-title">Policy & Coverage Details</Heading>
            </div>
            <div className="asset-info-grid">
              <div className="asset-info-item">
                <span className="asset-info-key">Coverage Type</span>
                <span className="asset-info-val">{asset.coverageType}</span>
              </div>
              <div className="asset-info-item">
                <span className="asset-info-key">Coverage Limit</span>
                <span className="asset-info-val">{formatCurrencyFull(asset.coverageLimit)}</span>
              </div>
              <div className="asset-info-item">
                <span className="asset-info-key">Deductible</span>
                <span className="asset-info-val">{formatCurrencyFull(asset.deductible)}</span>
              </div>
              {type === 'Property' && (
                <>
                  <div className="asset-info-item">
                    <span className="asset-info-key">Property Type</span>
                    <span className="asset-info-val">{asset.propertyType}</span>
                  </div>
                  <div className="asset-info-item">
                    <span className="asset-info-key">Year Built</span>
                    <span className="asset-info-val">{asset.yearBuilt}</span>
                  </div>
                  <div className="asset-info-item">
                    <span className="asset-info-key">Square Feet</span>
                    <span className="asset-info-val">{asset.squareFeet?.toLocaleString()} sq ft</span>
                  </div>
                  <div className="asset-info-item">
                    <span className="asset-info-key">Address</span>
                    <span className="asset-info-val">{asset.address}</span>
                  </div>
                  <div className="asset-info-item">
                    <span className="asset-info-key">Occupancy</span>
                    <span className="asset-info-val">{asset.occupancy}</span>
                  </div>
                </>
              )}
              {type === 'Auto' && (
                <>
                  <div className="asset-info-item">
                    <span className="asset-info-key">Vehicle Type</span>
                    <span className="asset-info-val">{asset.vehicleType}</span>
                  </div>
                  <div className="asset-info-item">
                    <span className="asset-info-key">VIN</span>
                    <span className="asset-info-val asset-info-val--mono">{asset.vin}</span>
                  </div>
                  <div className="asset-info-item">
                    <span className="asset-info-key">License Plate</span>
                    <span className="asset-info-val">{asset.licensePlate}</span>
                  </div>
                  <div className="asset-info-item">
                    <span className="asset-info-key">Mileage</span>
                    <span className="asset-info-val">{asset.currentMileage?.toLocaleString()} mi</span>
                  </div>
                  <div className="asset-info-item">
                    <span className="asset-info-key">Assigned Driver</span>
                    <span className="asset-info-val">{asset.assignedDriver}</span>
                  </div>
                  <div className="asset-info-item">
                    <span className="asset-info-key">Department</span>
                    <span className="asset-info-val">{asset.department}</span>
                  </div>
                </>
              )}
            </div>
          </Tile>
        </Column>

        {/* Supporting Media Placeholder */}
        <Column lg={8} md={4} sm={4}>
          <Tile className="asset-media-tile">
            <div className="asset-info-title-row">
              <Camera size={20} />
              <Heading className="asset-info-title">Supporting Media & Documents</Heading>
            </div>
            <div className="asset-media-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="asset-media-placeholder">
                  <Camera size={24} className="asset-media-icon" />
                  <span className="asset-media-label">
                    {type === 'Property' ? `Property Photo ${i}` : `Vehicle Photo ${i}`}
                  </span>
                </div>
              ))}
              <div className="asset-media-placeholder asset-media-placeholder--doc">
                <Document size={24} className="asset-media-icon" />
                <span className="asset-media-label">Underwriting Doc</span>
              </div>
              <div className="asset-media-placeholder asset-media-placeholder--doc">
                <Document size={24} className="asset-media-icon" />
                <span className="asset-media-label">Policy Agreement</span>
              </div>
              <div className="asset-media-placeholder asset-media-placeholder--doc">
                <Document size={24} className="asset-media-icon" />
                <span className="asset-media-label">Inspection Report</span>
              </div>
            </div>
          </Tile>
        </Column>

        {/* Claims History */}
        <Column lg={16} md={8} sm={4}>
          <Tile className="asset-claims-tile">
            <Heading className="asset-claims-title">Full Claims History</Heading>
            {claims.length === 0 ? (
              <div className="asset-no-claims">
                <CheckmarkFilled size={24} className="asset-no-claims-icon" />
                <p>No claims have been filed for this asset.</p>
              </div>
            ) : (
              <DataTable rows={claimRows} headers={claimHeaders} isSortable={false}>
                {({ rows, headers, getHeaderProps, getTableProps }) => (
                  <TableContainer>
                    <Table {...getTableProps()} size="lg">
                      <TableHead>
                        <TableRow>
                          {headers.map(h => (
                            <TableHeader key={h.key} {...getHeaderProps({ header: h })}>
                              {h.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map(row => (
                          <TableRow key={row.id}>
                            {row.cells.map(cell => (
                              <TableCell key={cell.id}>
                                {cell.info.header === 'status' ? (
                                  <StatusTag status={cell.value} />
                                ) : (
                                  cell.value
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DataTable>
            )}
          </Tile>
        </Column>

        {/* Back Button Footer */}
        <Column lg={16} md={8} sm={4} className="asset-detail-footer">
          <Button kind="secondary" renderIcon={ArrowLeft} onClick={() => navigate(-1)}>
            Back to Dashboard
          </Button>
        </Column>
      </Grid>
    </div>
  );
}

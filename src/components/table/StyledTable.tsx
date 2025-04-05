import styled from 'styled-components';

export const TableContainer = styled.div`
  width: 100%;
  border: 1px solid ${props => props.theme?.palette?.divider || '#e0e0e0'};
  border-radius: 16px;
  overflow: hidden;
  background-color: ${props => props.theme?.palette?.background?.paper || '#fff'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-family: ${props => props.theme?.typography?.fontFamily || '"Roboto", "Helvetica", "Arial", sans-serif'};
`;

export const TableHead = styled.thead`
  background-color: ${props => props.theme?.palette?.background?.default || '#f5f5f5'};
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const TableHeaderRow = styled.tr`
  height: 56px;
`;

export const TableHeaderCell = styled.th<{ width?: string }>`
  color: ${props => props.theme?.palette?.text?.secondary || '#666'};
  font-weight: 500;
  text-align: left;
  padding: 16px;
  user-select: none;
  width: ${props => props.width || 'auto'};
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  
  &:hover {
    background-color: ${props => props.theme?.palette?.action?.hover || '#f0f0f0'};
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme?.palette?.divider || '#e0e0e0'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme?.palette?.action?.hover || '#f0f0f0'};
  }
`;

export const TableCell = styled.td`
  color: ${props => props.theme?.palette?.text?.primary || '#333'};
  padding: 16px;
  font-size: 14px;
  line-height: 1.5;
  white-space: nowrap;
`;

export const StatusCell = styled(TableCell)<{ status: string }>`
  & > span {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    background-color: ${props => {
      switch (props.status) {
        case 'completed':
          return '#e6f7e6';
        case 'in_progress':
          return '#e3f2fd';
        case 'blocked':
          return '#ffebee';
        case 'not_started':
          return '#f5f5f5';
        case 'in_review':
          return '#fff8e1';
        case 'deferred':
          return '#e8eaf6';
        default:
          return '#f5f5f5';
      }
    }};
    color: ${props => {
      switch (props.status) {
        case 'completed':
          return '#388e3c';
        case 'in_progress':
          return '#1976d2';
        case 'blocked':
          return '#d32f2f';
        case 'not_started':
          return '#616161';
        case 'in_review':
          return '#f57c00';
        case 'deferred':
          return '#3f51b5';
        default:
          return '#616161';
      }
    }};
  }
`;

export const PriorityCell = styled(TableCell)<{ priority: string }>`
  & > span {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    background-color: ${props => {
      switch (props.priority) {
        case 'critical':
          return '#ffebee';
        case 'high':
          return '#fff8e1';
        case 'medium':
          return '#e8f5e9';
        case 'low':
          return '#e8eaf6';
        case 'normal':
          return '#f5f5f5';
        default:
          return '#f5f5f5';
      }
    }};
    color: ${props => {
      switch (props.priority) {
        case 'critical':
          return '#d32f2f';
        case 'high':
          return '#f57c00';
        case 'medium':
          return '#388e3c';
        case 'low':
          return '#3f51b5';
        case 'normal':
          return '#616161';
        default:
          return '#616161';
      }
    }};
  }
`;

export const TableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px;
  background-color: ${props => props.theme?.palette?.background?.paper || '#fff'};
  border-top: 1px solid ${props => props.theme?.palette?.divider || '#e0e0e0'};
`;

export const NoDataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 100%;
  font-size: 16px;
  color: ${props => props.theme?.palette?.text?.secondary || '#666'};
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 100%;
`; 
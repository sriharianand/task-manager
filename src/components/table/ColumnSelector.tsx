import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  ViewColumn as ColumnIcon,
} from '@mui/icons-material';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import StyledThemeProvider from '../../theme/StyledThemeProvider';

export interface Column {
  id: string;
  label: string;
  visible: boolean;
  width?: string;
}

interface ColumnSelectorProps {
  columns: Column[];
  onChange: (columns: Column[]) => void;
}

const ColumnButton = styled(Button)`
  margin-bottom: 16px;
`;

const DragList = styled.div`
  padding: 8px 0;
`;

const DragItem = styled.div<{ isDragging: boolean }>`
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  background-color: ${props => props.isDragging ? props.theme?.palette?.action?.hover || '#f0f0f0' : 'transparent'};
  box-shadow: ${props => props.isDragging ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ columns, onChange }) => {
  const [open, setOpen] = useState(false);
  const [localColumns, setLocalColumns] = useState<Column[]>([]);
  const theme = useTheme();

  const handleOpen = () => {
    setLocalColumns([...columns]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    onChange(localColumns);
    setOpen(false);
  };

  const handleToggleVisibility = (index: number) => {
    const newColumns = [...localColumns];
    newColumns[index] = {
      ...newColumns[index],
      visible: !newColumns[index].visible,
    };
    setLocalColumns(newColumns);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(localColumns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalColumns(items);
  };

  const handleKeyToggle = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggleVisibility(index);
    }
  };

  return (
    <StyledThemeProvider theme={theme}>
      <Button
        startIcon={<ColumnIcon />}
        onClick={handleOpen}
        variant="outlined"
        size="small"
        aria-label="Manage columns"
        aria-haspopup="dialog"
      >
        Manage Columns
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose}
        aria-labelledby="column-selector-dialog-title"
        maxWidth="xs" 
        fullWidth
      >
        <DialogTitle id="column-selector-dialog-title">Manage Columns</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" paragraph>
            Drag columns to reorder or toggle visibility. At least one column must be visible.
          </Typography>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="columns">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  role="list"
                  aria-label="Column list"
                >
                  {localColumns.map((column, index) => (
                    <Draggable key={column.id} draggableId={column.id} index={index}>
                      {(provided) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          divider
                          role="listitem"
                          aria-label={column.label}
                        >
                          <ListItemIcon
                            {...provided.dragHandleProps}
                            aria-label={`Drag ${column.label} to reorder`}
                          >
                            <DragIcon />
                          </ListItemIcon>
                          <ListItemText primary={column.label} />
                          <Checkbox
                            edge="end"
                            checked={column.visible}
                            onChange={() => handleToggleVisibility(index)}
                            onKeyDown={(e) => handleKeyToggle(e, index)}
                            inputProps={{
                              'aria-label': `Toggle visibility of ${column.label} column`,
                              'aria-checked': column.visible
                            }}
                            tabIndex={0}
                            disabled={column.visible && localColumns.filter(c => c.visible).length === 1}
                          />
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose}
            aria-label="Cancel column changes"
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            aria-label="Save column changes"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </StyledThemeProvider>
  );
};

export default ColumnSelector; 
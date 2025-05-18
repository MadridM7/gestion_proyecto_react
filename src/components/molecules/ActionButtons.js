/**
 * @fileoverview Grupo de botones de acción para operaciones en tablas
 */
import React from 'react';
import { Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * Componente molecular para botones de acción en tablas
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Grupo de botones de acción
 */
const ActionButtons = ({ 
  onEdit, 
  onDelete, 
  record,
  deleteConfirmTitle = '¿Estás seguro de eliminar este registro?',
  deleteConfirmDescription = 'Esta acción no se puede deshacer',
  editTooltip = 'Editar',
  deleteTooltip = 'Eliminar'
}) => {
  return (
    <Space size="small">
      {onEdit && (
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(record)}
          title={editTooltip}
          aria-label={editTooltip}
        />
      )}
      
      {onDelete && (
        <Popconfirm
          title={deleteConfirmTitle}
          description={deleteConfirmDescription}
          onConfirm={() => onDelete(record.id)}
          okText="Sí"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            title={deleteTooltip}
            aria-label={deleteTooltip}
          />
        </Popconfirm>
      )}
    </Space>
  );
};

ActionButtons.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  record: PropTypes.object.isRequired,
  deleteConfirmTitle: PropTypes.string,
  deleteConfirmDescription: PropTypes.string,
  editTooltip: PropTypes.string,
  deleteTooltip: PropTypes.string
};

export default ActionButtons;

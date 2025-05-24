/**
 * @fileoverview Componente para mostrar los detalles de un usuario y editarlo directamente en el panel
 */
import React, { useState } from 'react';
import { Card, Descriptions, Divider, Empty, Button, Popconfirm, message, Form, Input, Select, Switch, Tag } from 'antd';
import ReactDatePickerWrapper from '../atoms/ReactDatePickerWrapper';
import { 
  UserOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  MailOutlined, 
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SaveOutlined,
  TeamOutlined,
  LockOutlined
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useUsuarios } from '../../context/UsuariosContext';
import '../../styles/components/organisms/UsuarioDetail.css';

const { Option } = Select;

/**
 * Componente para mostrar los detalles de un usuario y editarlo directamente en el panel
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.usuario - Datos del usuario a mostrar
 * @param {Function} props.onEdit - Función para editar el usuario
 * @param {boolean} props.inMobileModal - Indica si el componente se muestra en un modal móvil
 * @returns {JSX.Element} Componente de detalles del usuario
 */
const UsuarioDetail = ({ usuario, onEdit, inMobileModal = false }) => {
  const { eliminarUsuario, actualizarUsuario } = useUsuarios();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  
  // Manejar eliminación de usuario
  const handleDelete = async () => {
    try {
      await eliminarUsuario(usuario.id);
      message.success('Usuario eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      message.error('Error al eliminar el usuario');
    }
  };

  // Funciones para manejar la edición
  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      ...usuario,
      fechaRegistro: usuario.fechaRegistro ? new Date(usuario.fechaRegistro) : null
    });
  };
  
  const handleSave = () => {
    form.validateFields().then(values => {
      // Preparar los datos actualizados
      const usuarioActualizado = {
        ...usuario, // Mantener los datos originales
        ...values,  // Sobrescribir con los nuevos valores
        fechaRegistro: values.fechaRegistro instanceof Date ? values.fechaRegistro : new Date(),
        id: usuario.id
      };
      
      // Si no se ingresó una nueva contraseña, mantener la actual
      if (!values.password || values.password.trim() === '') {
        usuarioActualizado.password = usuario.password;
      }
      
      actualizarUsuario(usuario.id, usuarioActualizado);
      setIsEditing(false);
      message.success('Usuario actualizado correctamente');
    }).catch(error => {
      console.error('Error al validar el formulario:', error);
      message.error('Por favor completa todos los campos requeridos');
    });
  };
  
  // Función para cancelar la edición
  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
    message.info('Edición cancelada');
  };
  
  if (!usuario) {
    return (
      <Card className="usuario-detail-card">
        <Empty description="Selecciona un usuario para ver sus detalles" />
      </Card>
    );
  }

  // Formatear fecha
  const formatFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  // Roles disponibles
  const roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'vendedor', label: 'Vendedor' },
    { value: 'supervisor', label: 'Supervisor' }
  ];

  // Configuración de colores para los roles
  const rolConfig = {
    'admin': { color: 'red', text: 'Administrador' },
    'vendedor': { color: 'green', text: 'Vendedor' },
    'supervisor': { color: 'blue', text: 'Supervisor' }
  };
  
  const { color: rolColor, text: rolText } = rolConfig[usuario.rol] || { color: 'default', text: usuario.rol };

  return (
    <Card 
      title={!inMobileModal ? <div className="usuario-detail-title"><UserOutlined /> {isEditing ? 'Editar Usuario' : 'Detalles del Usuario'}</div> : null}
      className="usuario-detail-card"
      extra={
        usuario && (
          <div className={`usuario-detail-actions ${inMobileModal ? 'mobile-centered' : ''}`}>
            {isEditing ? (
              <div className="usuario-action-buttons">
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />} 
                  onClick={handleSave}
                >
                  Guardar
                </Button>
                <Button 
                  icon={<CloseCircleOutlined />} 
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="usuario-action-buttons">
                <Button 
                  type="primary" 
                  icon={<EditOutlined />} 
                  onClick={handleEdit}
                >
                  Editar
                </Button>
                <Popconfirm
                  title="¿Estás seguro de eliminar este usuario?"
                  onConfirm={handleDelete}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                  >
                    Eliminar
                  </Button>
                </Popconfirm>
              </div>
            )}
          </div>
        )
      }
    >
      <div className="usuario-detail-content">
        {isEditing ? (
          <Form
            form={form}
            layout="vertical"
            className="usuario-edit-form"
          >
            <Form.Item
              name="id"
              label="ID de Usuario"
              rules={[{ required: true, message: 'El ID es obligatorio' }]}
            >
              <Input prefix={<UserOutlined />} disabled />
            </Form.Item>
            
            <Form.Item
              name="nombre"
              label="Nombre"
              rules={[
                { required: true, message: 'Por favor ingresa el nombre del usuario' },
                { min: 3, message: 'El nombre debe tener al menos 3 caracteres' },
                { max: 100, message: 'El nombre no puede exceder los 100 caracteres' },
                { pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,\-_()]+$/, message: 'El nombre contiene caracteres no permitidos' }
              ]}
              help="Nombre completo del usuario (3-100 caracteres)"
            >
              <Input 
                placeholder="Nombre del usuario" 
                prefix={<UserOutlined />}
                maxLength={100}
                showCount
              />
            </Form.Item>
            
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Por favor ingresa el email del usuario' },
                { type: 'email', message: 'Por favor ingresa un email válido' }
              ]}
              help="Dirección de correo electrónico del usuario"
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email"
                autoComplete="new-email" // Evitar autocompletado
              />
            </Form.Item>
            
            <Form.Item
              name="password"
              label="Contraseña"
              rules={[
                { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
                { max: 20, message: 'La contraseña no puede exceder los 20 caracteres' }
              ]}
              help="Dejar en blanco para mantener la contraseña actual"
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Nueva contraseña" 
                maxLength={20}
                autoComplete="new-password" // Evitar autocompletado
              />
            </Form.Item>
            
            <Form.Item
              name="rol"
              label="Rol"
              rules={[{ required: true, message: 'Por favor selecciona un rol' }]}
              help="Nivel de acceso y permisos del usuario en el sistema"
            >
              <Select 
                placeholder="Selecciona un rol"
                suffixIcon={<TeamOutlined />}
                showSearch
                optionFilterProp="children"
              >
                {roles.map(rol => (
                  <Option key={rol.value} value={rol.value}>{rol.label}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="fechaRegistro"
              label="Fecha de registro"
              rules={[{ required: true, message: 'Por favor selecciona la fecha de registro' }]}
              help="Fecha en que el usuario fue registrado en el sistema"
            >
              <ReactDatePickerWrapper
                name="fechaRegistro"
                label="Fecha de registro"
                placeholder="Selecciona una fecha"
                onChange={(date) => form.setFieldsValue({ fechaRegistro: date })}
                maxDate={new Date()}
              />
            </Form.Item>
            
            <Form.Item
              name="activo"
              label="Estado"
              valuePropName="checked"
              help="Determina si el usuario puede acceder al sistema"
            >
              <Switch 
                checkedChildren="Activo" 
                unCheckedChildren="Inactivo" 
              />
            </Form.Item>
          </Form>
        ) : (
          <>
            <Descriptions bordered column={1} className="usuario-descriptions">
              <Descriptions.Item label="ID">{usuario.id}</Descriptions.Item>
              <Descriptions.Item label="Nombre">{usuario.nombre}</Descriptions.Item>
              <Descriptions.Item label="Email">{usuario.email}</Descriptions.Item>
              <Descriptions.Item label="Rol">
                <Tag color={rolColor}>{rolText}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Estado">
                {usuario.activo ? (
                  <Tag color="success" icon={<CheckCircleOutlined />}>Activo</Tag>
                ) : (
                  <Tag color="error" icon={<CloseCircleOutlined />}>Inactivo</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>

            <Divider />
            
            <div className="usuario-detail-footer">
              <div className="usuario-detail-stat">
                <CalendarOutlined /> Fecha de registro: {usuario.fechaRegistro ? formatFecha(usuario.fechaRegistro) : 'No disponible'}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

UsuarioDetail.propTypes = {
  usuario: PropTypes.object,
  onEdit: PropTypes.func,
  inMobileModal: PropTypes.bool
};

export default UsuarioDetail;

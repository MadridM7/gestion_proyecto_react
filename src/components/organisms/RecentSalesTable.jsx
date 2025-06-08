/**
 * @fileoverview Componente de tabla para mostrar las ventas más recientes
 * Implementa optimización para visualización en dispositivos móviles
 */
import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Tooltip, Badge, Typography, Button, List, Space } from 'antd';
import { 
  CalendarOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useVentas } from '../../context/VentasContext';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/components/organisms/RecentSalesTable.css';

const { Text } = Typography;

/**
 * Componente que muestra una tabla con las ventas más recientes
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tabla de ventas recientes
 */
const RecentSalesTable = ({ 
  timeRange,
  limit = 5, 
  onViewDetail
}) => {
  const { ventas } = useVentas();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  // Estado para detectar si es dispositivo móvil
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar si es dispositivo móvil al cargar y al cambiar el tamaño de la ventana
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Verificar al cargar el componente
    checkIfMobile();
    
    // Verificar al cambiar el tamaño de la ventana
    window.addEventListener('resize', checkIfMobile);
    
    // Limpiar el event listener al desmontar el componente
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    if (!ventas || ventas.length === 0) {
      setLoading(false);
      return;
    }

    // Filtrar por rango de tiempo
    let ventasFiltradas = ventas.filter(venta => {
      if (!venta.fechaHora) {
        console.log('Venta sin fecha:', venta);
        return false;
      }
      
      // Validar que timeRange y sus propiedades existan
      if (!timeRange || !timeRange.startDate || !timeRange.endDate) {
        console.log('timeRange incompleto, incluyendo todas las ventas');
        return true;
      }
      
      try {
        const fechaVenta = new Date(venta.fechaHora);
        const startDate = new Date(timeRange.startDate);
        const endDate = new Date(timeRange.endDate);
        
        // Incluir ventas dentro del rango (incluyendo los límites)
        return fechaVenta >= startDate && fechaVenta <= endDate;
      } catch (error) {
        console.error('Error al procesar fecha:', venta.fechaHora, error);
        return false;
      }
    });

    // Ordenar por fecha descendente (más recientes primero)
    ventasFiltradas.sort((a, b) => {
      try {
        const fechaA = new Date(a.fechaHora);
        const fechaB = new Date(b.fechaHora);
        // Asegurar que las ventas más recientes aparecen primero (orden descendente)
        return fechaB.getTime() - fechaA.getTime();
      } catch (error) {
        console.error('Error al ordenar ventas por fecha:', error);
        return 0;
      }
    });
    
    console.log('Ventas ordenadas por fecha (las más recientes primero):', 
      ventasFiltradas.map(v => ({ id: v.id, fecha: v.fechaHora })));

    // Limitar a la cantidad especificada
    ventasFiltradas = ventasFiltradas.slice(0, limit);

    // Procesar datos para la tabla
    const ventasFormateadas = ventasFiltradas.map((venta, index) => {
      // Calcular cantidad de productos
      const cantidadProductos = venta.productos?.reduce((sum, item) => sum + item.cantidad, 0) || 0;
      
      // Formatear fecha
      const fechaVenta = new Date(venta.fechaHora);
      const fechaFormateada = fechaVenta.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
      const horaFormateada = fechaVenta.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });

      return {
        key: venta.id || `venta-${index}`,
        id: venta.id || `#${index + 1}`,
        vendedor: venta.vendedor,
        fecha: fechaVenta,
        fechaFormateada,
        horaFormateada,
        monto: venta.monto || 0,
        estado: venta.estado || 'completada',
        tipoPago: venta.tipoPago || 'efectivo',
        cantidadProductos,
        productos: venta.productos || []
      };
    });

    setDataSource(ventasFormateadas);
    setLoading(false);
  }, [ventas, timeRange, limit]);

  /**
   * Renderiza el tipo de pago
   * @param {string} tipo - Tipo de pago
   * @returns {JSX.Element} Etiqueta con el tipo de pago formateado
   */
  const renderTipoPago = (tipo) => {
    const tipoLower = tipo.toLowerCase();
    let color;

    switch (tipoLower) {
      case 'efectivo':
        color = 'green';
        break;
      case 'debito':
        color = 'blue';
        break;
      case 'credito':
        color = 'orange';
        break;
      default:
        color = 'default';
    }

    return <Tag color={color}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</Tag>;
  };

  /**
   * Renderiza la cantidad de productos
   * @param {number} cantidad - Cantidad de productos
   * @returns {JSX.Element} Badge con la cantidad
   */
  const renderCantidadProductos = (cantidad) => {
    return cantidad > 0 ? <Badge count={cantidad} overflowCount={99} /> : <Text type="secondary">0</Text>;
  };

  // Columnas para la vista de escritorio
  const desktopColumns = [
    {
      title: 'ID Venta',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => <Text strong>{id}</Text>
    },
    {
      title: 'Vendedor',
      dataIndex: 'vendedor',
      key: 'vendedor',
      render: (vendedor) => <Text strong>{vendedor}</Text>
    },
    {
      title: 'Fecha',
      dataIndex: 'fechaFormateada',
      key: 'fecha',
      render: (fechaFormateada, record) => {
        // Verificar si tenemos los datos formateados
        if (!fechaFormateada || !record.horaFormateada) {
          return <Typography.Text type="secondary">No disponible</Typography.Text>;
        }
        
        return (
          <Tooltip title={`${fechaFormateada} a las ${record.horaFormateada}`}>
            <div>
              <div>{fechaFormateada}</div>
              <Typography.Text type="secondary">{record.horaFormateada}</Typography.Text>
            </div>
          </Tooltip>
        );
      },
      sorter: (a, b) => {
        try {
          return new Date(a.fecha) - new Date(b.fecha);
        } catch (error) {
          return 0;
        }
      }
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      align: 'right',
      render: (monto) => <Text strong>{formatCurrency(monto)}</Text>,
      sorter: (a, b) => a.monto - b.monto
    },
    {
      title: 'Productos',
      dataIndex: 'cantidadProductos',
      key: 'cantidadProductos',
      align: 'center',
      render: renderCantidadProductos
    },
    {
      title: 'Pago',
      dataIndex: 'tipoPago',
      key: 'tipoPago',
      render: renderTipoPago
    }
  ];
  
  // Columnas para la vista móvil (versión simplificada con menos columnas)
  const mobileColumns = [
    {
      title: 'Venta',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <div className="mobile-sale-info">
          <Text strong>{id}</Text>
          <Text type="secondary" className="mobile-vendor">{record.vendedor}</Text>
        </div>
      )
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      align: 'right',
      render: (monto) => <Text strong>{formatCurrency(monto)}</Text>,
    },
    {
      title: 'Tipo',
      dataIndex: 'tipoPago',
      key: 'tipoPago',
      render: renderTipoPago
    }
  ];
  
  // Seleccionar columnas según el tipo de dispositivo
  const columns = isMobile ? mobileColumns : desktopColumns;

  const extra = (
    <Button 
      type="link" 
      onClick={() => onViewDetail && onViewDetail({type: 'all'})}
      className="view-all-button"
    >
      Ver todas
    </Button>
  );

  // Renderizado para vista móvil con Lista en lugar de Tabla
  const renderMobileView = () => {
    return (
      <List
        className="mobile-sales-list"
        loading={loading}
        locale={{
          emptyText: (
            <div style={{ padding: '20px 0' }}>
              <p>No hay ventas recientes para mostrar</p>
            </div>
          )
        }}
        dataSource={dataSource}
        renderItem={item => (
          <List.Item 
            className="mobile-sale-item"
            onClick={() => onViewDetail && onViewDetail({ type: 'venta', id: item.id })}
          >
            <div className="mobile-sale-content">
              <div className="mobile-sale-header">
                <span className="sale-id">{item.id}</span>
                <span className="sale-amount">{formatCurrency(item.monto)}</span>
              </div>
              
              <div className="mobile-sale-details">
                <Space size={16}>
                  <span className="sale-detail-item">
                    <UserOutlined /> {item.vendedor}
                  </span>
                  <span className="sale-detail-item">
                    <CalendarOutlined /> {item.fechaFormateada}
                  </span>
                  <span className="sale-detail-item payment-type">
                    {renderTipoPago(item.tipoPago)}
                  </span>
                </Space>
              </div>
              
              <div className="mobile-sale-products">
                <Badge count={item.cantidadProductos} overflowCount={99} /> 
                <span className="products-label">productos</span>
              </div>
            </div>
          </List.Item>
        )}
      />
    );
  };
  
  return (
    <Card
      title="Ventas Recientes"
      className={`recent-sales-table-card ${isMobile ? 'mobile-card' : ''}`}
      extra={extra}
      style={{ height: isMobile ? "auto" : "430px" }}
      bodyStyle={{ padding: isMobile ? '8px' : '24px' }}
    >
      {isMobile ? (
        renderMobileView()
      ) : (
        <Table
          dataSource={dataSource}
          loading={loading}
          pagination={false}
          columns={columns}
          size="small"
          className="recent-sales-table"
          locale={{
            emptyText: (
              <div style={{ padding: '20px 0' }}>
                <p>No hay ventas recientes para mostrar</p>
              </div>
            )
          }}
          onRow={(record) => ({
            onClick: () => onViewDetail && onViewDetail({ type: 'venta', id: record.id })
          })}
        />
      )}
    </Card>
  );
};

export default RecentSalesTable;

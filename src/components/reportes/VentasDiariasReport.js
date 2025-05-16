import React, { useState, useEffect } from 'react';
import { Table, Typography, Statistic, Row, Col, Card, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useVentas } from '../../context/VentasContext';
import moment from 'moment';

const { Title, Text } = Typography;

/**
 * Componente para mostrar el reporte de ventas diarias
 * @returns {JSX.Element} Reporte de ventas diarias
 */
const VentasDiariasReport = () => {
  const { ventas } = useVentas();
  const [ventasPorDia, setVentasPorDia] = useState([]);
  const [comparacion, setComparacion] = useState({
    porcentaje: 0,
    incremento: false
  });

  // Agrupar ventas por día
  useEffect(() => {
    if (!ventas || ventas.length === 0) return;

    // Obtener los últimos 7 días
    const ultimosDias = [];
    for (let i = 6; i >= 0; i--) {
      const fecha = moment().subtract(i, 'days');
      ultimosDias.push(fecha.format('YYYY-MM-DD'));
    }

    // Inicializar el objeto para agrupar ventas por día
    const ventasPorDiaObj = {};
    ultimosDias.forEach(dia => {
      ventasPorDiaObj[dia] = {
        fecha: dia,
        total: 0,
        cantidad: 0,
        promedio: 0,
        ventas: []
      };
    });

    // Agrupar ventas por día
    ventas.forEach(venta => {
      if (!(venta.fechaHora instanceof Date)) return;
      
      const fechaStr = moment(venta.fechaHora).format('YYYY-MM-DD');
      if (ventasPorDiaObj[fechaStr]) {
        ventasPorDiaObj[fechaStr].total += venta.monto;
        ventasPorDiaObj[fechaStr].cantidad += 1;
        ventasPorDiaObj[fechaStr].ventas.push(venta);
      }
    });

    // Calcular promedio por día
    Object.keys(ventasPorDiaObj).forEach(dia => {
      const { total, cantidad } = ventasPorDiaObj[dia];
      ventasPorDiaObj[dia].promedio = cantidad > 0 ? total / cantidad : 0;
    });

    // Convertir a array para la tabla
    const ventasPorDiaArray = Object.values(ventasPorDiaObj).map(item => ({
      ...item,
      fecha: moment(item.fecha).format('DD/MM/YYYY'),
      key: item.fecha
    }));

    // Ordenar por fecha (más reciente primero)
    ventasPorDiaArray.sort((a, b) => moment(b.fecha, 'DD/MM/YYYY').valueOf() - moment(a.fecha, 'DD/MM/YYYY').valueOf());

    setVentasPorDia(ventasPorDiaArray);

    // Calcular comparación con el día anterior
    if (ventasPorDiaArray.length >= 2) {
      const hoy = ventasPorDiaArray[0].total;
      const ayer = ventasPorDiaArray[1].total;
      
      if (ayer > 0) {
        const porcentaje = ((hoy - ayer) / ayer) * 100;
        setComparacion({
          porcentaje: Math.abs(porcentaje).toFixed(2),
          incremento: porcentaje >= 0
        });
      }
    }
  }, [ventas]);

  // Columnas para la tabla
  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
    },
    {
      title: 'Ventas',
      dataIndex: 'cantidad',
      key: 'cantidad',
      render: (cantidad) => cantidad,
      sorter: (a, b) => a.cantidad - b.cantidad,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${total.toLocaleString('es-CL')}`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Promedio',
      dataIndex: 'promedio',
      key: 'promedio',
      render: (promedio) => `$${Math.round(promedio).toLocaleString('es-CL')}`,
      sorter: (a, b) => a.promedio - b.promedio,
    }
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Ventas de Hoy"
              value={ventasPorDia.length > 0 ? ventasPorDia[0].cantidad : 0}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<Text type="secondary">Total:</Text>}
              suffix={<Text type="secondary">transacciones</Text>}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Ingresos de Hoy"
              value={ventasPorDia.length > 0 ? ventasPorDia[0].total : 0}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix="$"
              formatter={(value) => `${value.toLocaleString('es-CL')}`}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Comparación con Ayer"
              value={comparacion.porcentaje}
              precision={2}
              valueStyle={{ color: comparacion.incremento ? '#3f8600' : '#cf1322' }}
              prefix={comparacion.incremento ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="%"
            />
            <Text type="secondary">
              {comparacion.incremento ? 'Incremento' : 'Decremento'} respecto a ayer
            </Text>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 16 }}>
        <Table 
          columns={columns} 
          dataSource={ventasPorDia} 
          pagination={false}
          size="small"
        />
      </div>
    </div>
  );
};

export default VentasDiariasReport;

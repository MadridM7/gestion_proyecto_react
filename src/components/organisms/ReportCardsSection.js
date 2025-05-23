/**
 * @fileoverview Componente organismo para la sección de tarjetas de reportes con diseño mejorado
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Select, Tabs } from 'antd';
import ReactDatePickerWrapper from '../atoms/ReactDatePickerWrapper';
import { 
  CalendarOutlined, 
  FileTextOutlined,
  UserOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import ReportTypeCard from '../molecules/ReportTypeCard';

// Configurar moment para usar el locale español
//moment.locale('es');

const { Option } = Select;

/**
 * Componente organismo que muestra la sección de tarjetas de reportes con diseño mejorado
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Sección de tarjetas de reportes
 */
const ReportCardsSection = ({ 
  onGenerateDaily,
  onGenerateWeekly,
  onGenerateMonthly,
  onGenerateProducts,
  onGenerateUserSales,
  onGenerateComplete,
  usuarios,
  selectedUserId,
  onUserChange,
  dailyDate,
  weeklyDate,
  monthlyDate,
  onDailyDateChange,
  onWeeklyDateChange,
  onMonthlyDateChange,
  loading = false
}) => {
  const [activeTabKey, setActiveTabKey] = useState('1');

  // Colores para las tarjetas
  const colors = {
    daily: '#1890ff',     // Azul
    weekly: '#52c41a',    // Verde
    monthly: '#722ed1',   // Morado
    products: '#fa8c16',  // Naranja
    users: '#eb2f96',     // Rosa
    complete: '#13c2c2'   // Cyan
  };

  const items = [
    {
      key: '1',
      label: 'Por período',
      children: (
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={8}>
            <ReportTypeCard
              title="Reporte Diario"
              icon={<ClockCircleOutlined />}
              color={colors.daily}
              onGenerate={onGenerateDaily}
              buttonText="Generar reporte diario"
              loading={loading}
            >
              <ReactDatePickerWrapper
                label="Seleccionar día"
                placeholder="Seleccionar día"
                value={dailyDate}
                onChange={onDailyDateChange}
                rules={[{ required: true, message: 'Por favor selecciona un día' }]}
              />
            </ReportTypeCard>
          </Col>
          
          <Col xs={24} sm={24} md={8}>
            <ReportTypeCard
              title="Reporte Semanal"
              icon={<CalendarOutlined />}
              color={colors.weekly}
              onGenerate={onGenerateWeekly}
              buttonText="Generar reporte semanal"
              loading={loading}
            >
              <ReactDatePickerWrapper
                label="Seleccionar semana"
                placeholder="Seleccionar semana"
                value={weeklyDate}
                onChange={onWeeklyDateChange}
                showWeekNumbers={true}
                dateFormat="'Semana' ww, yyyy"
                rules={[{ required: true, message: 'Por favor selecciona una semana' }]}
              />
            </ReportTypeCard>
          </Col>
          
          <Col xs={24} sm={24} md={8}>
            <ReportTypeCard
              title="Reporte Mensual"
              icon={<BarChartOutlined />}
              color={colors.monthly}
              onGenerate={onGenerateMonthly}
              buttonText="Generar reporte mensual"
              loading={loading}
            >
              <ReactDatePickerWrapper
                label="Seleccionar mes"
                placeholder="Seleccionar mes"
                value={monthlyDate}
                onChange={onMonthlyDateChange}
                showMonthYearPicker={true}
                dateFormat="MMMM yyyy"
                rules={[{ required: true, message: 'Por favor selecciona un mes' }]}
              />
            </ReportTypeCard>
          </Col>
        </Row>
      ),
    },
    {
      key: '2',
      label: 'Reportes especiales',
      children: (
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={8}>
            <ReportTypeCard
              title="Reporte de Productos"
              icon={<ShoppingOutlined />}
              color={colors.products}
              onGenerate={onGenerateProducts}
              buttonText="Generar reporte de productos"
              loading={loading}
            />
          </Col>
          
          <Col xs={24} sm={24} md={8}>
            <ReportTypeCard
              title="Reporte por Usuario"
              icon={<UserOutlined />}
              color={colors.users}
              onGenerate={onGenerateUserSales}
              buttonText="Generar reporte de usuario"
              loading={loading}
            >
              <Select
                style={{ width: '100%' }}
                placeholder="Seleccionar usuario"
                value={selectedUserId}
                onChange={onUserChange}
              >
                {usuarios.map(usuario => (
                  <Option key={usuario.id} value={usuario.id}>
                    {usuario.nombre}
                  </Option>
                ))}
              </Select>
            </ReportTypeCard>
          </Col>
          
          <Col xs={24} sm={24} md={8}>
            <ReportTypeCard
              title="Reporte Completo"
              icon={<FileTextOutlined />}
              color={colors.complete}
              onGenerate={onGenerateComplete}
              buttonText="Generar reporte completo"
              loading={loading}
            />
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div className="report-section">      
      <Tabs 
        activeKey={activeTabKey} 
        onChange={setActiveTabKey}
        items={items}
        size="large"
        tabBarStyle={{ marginBottom: 24 }}
      />
    </div>
  );
};

ReportCardsSection.propTypes = {
  onGenerateDaily: PropTypes.func.isRequired,
  onGenerateWeekly: PropTypes.func.isRequired,
  onGenerateMonthly: PropTypes.func.isRequired,
  onGenerateProducts: PropTypes.func.isRequired,
  onGenerateUserSales: PropTypes.func.isRequired,
  onGenerateComplete: PropTypes.func.isRequired,
  usuarios: PropTypes.array.isRequired,
  selectedUserId: PropTypes.string,
  onUserChange: PropTypes.func.isRequired,
  dailyDate: PropTypes.object,
  weeklyDate: PropTypes.object,
  monthlyDate: PropTypes.object,
  onDailyDateChange: PropTypes.func.isRequired,
  onWeeklyDateChange: PropTypes.func.isRequired,
  onMonthlyDateChange: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

ReportCardsSection.defaultProps = {
  dailyDate: new Date(),
  weeklyDate: new Date(),
  monthlyDate: new Date(),
  loading: false
};

export default ReportCardsSection;

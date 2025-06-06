/**
 * @fileoverview Template para la página de reportes
 * Implementado siguiendo la metodología Atomic Design
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Typography, Spin } from 'antd';
import ReportCardsSection from '../organisms/ReportCardsSection';
import StatsSection from '../organisms/StatsSection';
// Importación de estilos eliminada
import '../../styles/components/organisms/ReportCardsSection.css';

const { Content } = Layout;
const { Title } = Typography;

/**
 * Template para la página de reportes
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Template de reportes
 */
const ReportesTemplate = ({
  loading,
  keyStats,
  paymentStats,
  topSellers,
  // Datos para los reportes
  usuarios,
  selectedUserId,
  onUserChange,
  // Fechas para cada tipo de reporte
  dailyDate,
  weeklyDate,
  monthlyDate,
  // Manejadores para cada tipo de reporte
  onDailyDateChange,
  onWeeklyDateChange,
  onMonthlyDateChange,
  // Funciones de generación de reportes
  onGenerateDaily,
  onGenerateWeekly,
  onGenerateMonthly,
  onGenerateProducts,
  onGenerateUserSales,
  onGenerateComplete
}) => {
  return (
    <Content className="reports-container">
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <Title level={4} style={{ marginTop: 20 }}>Cargando datos...</Title>
        </div>
      ) : (
        <>
          <ReportCardsSection
            onGenerateDaily={onGenerateDaily}
            onGenerateWeekly={onGenerateWeekly}
            onGenerateMonthly={onGenerateMonthly}
            onGenerateProducts={onGenerateProducts}
            onGenerateUserSales={onGenerateUserSales}
            onGenerateComplete={onGenerateComplete}
            usuarios={usuarios}
            selectedUserId={selectedUserId}
            onUserChange={onUserChange}
            dailyDate={dailyDate}
            weeklyDate={weeklyDate}
            monthlyDate={monthlyDate}
            onDailyDateChange={onDailyDateChange}
            onWeeklyDateChange={onWeeklyDateChange}
            onMonthlyDateChange={onMonthlyDateChange}
            loading={loading}
          />
          
          <StatsSection
            keyStats={keyStats}
            paymentStats={paymentStats}
            topSellers={topSellers}
            loading={loading}
          />
        </>
      )}
    </Content>
  );
};

ReportesTemplate.propTypes = {
  loading: PropTypes.bool,
  keyStats: PropTypes.shape({
    totalVentas: PropTypes.number.isRequired,
    ingresosTotales: PropTypes.number.isRequired,
    gananciaNeta: PropTypes.number.isRequired,
    vendedoresActivos: PropTypes.number.isRequired,
    totalProductosVendidos: PropTypes.number
  }).isRequired,
  paymentStats: PropTypes.arrayOf(
    PropTypes.shape({
      method: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired
    })
  ).isRequired,
  topSellers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      sales: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired
    })
  ).isRequired,
  usuarios: PropTypes.array.isRequired,
  selectedUserId: PropTypes.string,
  onUserChange: PropTypes.func.isRequired,
  dailyDate: PropTypes.object,
  weeklyDate: PropTypes.object,
  monthlyDate: PropTypes.object,
  onDailyDateChange: PropTypes.func.isRequired,
  onWeeklyDateChange: PropTypes.func.isRequired,
  onMonthlyDateChange: PropTypes.func.isRequired,
  onGenerateDaily: PropTypes.func.isRequired,
  onGenerateWeekly: PropTypes.func.isRequired,
  onGenerateMonthly: PropTypes.func.isRequired,
  onGenerateProducts: PropTypes.func.isRequired,
  onGenerateUserSales: PropTypes.func.isRequired,
  onGenerateComplete: PropTypes.func.isRequired
};

ReportesTemplate.defaultProps = {
  loading: false
};

export default ReportesTemplate;

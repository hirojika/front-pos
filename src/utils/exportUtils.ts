/**
 * Utilidades para exportar datos a PDF y Excel
 */

/**
 * Exporta boletas a PDF
 * @param sales - Array de ventas a exportar
 * @param _filename - Nombre del archivo (para uso futuro)
 */
export const exportBoletasToPDF = (sales: any[], _filename: string = 'boletas.pdf') => {
  // Crear contenido HTML para el PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Reporte de Boletas</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
      </style>
    </head>
    <body>
      <h1>Reporte de Boletas</h1>
      <p>Fecha de generación: ${new Date().toLocaleString('es-CL')}</p>
      <table>
        <thead>
          <tr>
            <th>N° Boleta</th>
            <th>Fecha</th>
            <th>Sucursal</th>
            <th>Vendedor</th>
            <th>Método de Pago</th>
            <th class="text-right">Subtotal</th>
            <th class="text-right">IVA</th>
            <th class="text-right">Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${sales.map(sale => {
            const date = new Date(sale.date);
            const formattedDate = date.toLocaleDateString('es-CL');
            return `
              <tr>
                <td>${sale.id}</td>
                <td>${formattedDate}</td>
                <td>${sale.branch}</td>
                <td>${sale.seller}</td>
                <td>${sale.paymentMethod}</td>
                <td class="text-right">$${formatNumber(sale.subtotal)}</td>
                <td class="text-right">$${formatNumber(sale.iva)}</td>
                <td class="text-right">$${formatNumber(sale.total)}</td>
                <td>${sale.status}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" class="text-right"><strong>Total:</strong></td>
            <td class="text-right"><strong>$${formatNumber(sales.reduce((sum, s) => sum + s.subtotal, 0))}</strong></td>
            <td class="text-right"><strong>$${formatNumber(sales.reduce((sum, s) => sum + s.iva, 0))}</strong></td>
            <td class="text-right"><strong>$${formatNumber(sales.reduce((sum, s) => sum + s.total, 0))}</strong></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </body>
    </html>
  `;

  // Crear ventana para imprimir/guardar como PDF
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita ventanas emergentes para exportar el PDF');
    return;
  }

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Esperar a que se cargue y luego imprimir/guardar
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
};

/**
 * Exporta dashboard a PDF
 * @param dashboardData - Datos del dashboard a exportar
 * @param _filename - Nombre del archivo (para uso futuro)
 */
export const exportDashboardToPDF = (dashboardData: any, _filename: string = 'dashboard.pdf') => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Reporte de Dashboard</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { text-align: center; margin-bottom: 20px; }
        .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
        .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        .stat-card h3 { margin: 0 0 10px 0; color: #666; font-size: 14px; }
        .stat-card p { margin: 0; font-size: 24px; font-weight: bold; color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .text-right { text-align: right; }
      </style>
    </head>
    <body>
      <h1>Reporte de Dashboard</h1>
      <p>Fecha de generación: ${new Date().toLocaleString('es-CL')}</p>
      
      <div class="stats">
        <div class="stat-card">
          <h3>Ingresos Totales</h3>
          <p>$${formatNumber(dashboardData.totalRevenue || 0)}</p>
        </div>
        <div class="stat-card">
          <h3>Gastos Totales</h3>
          <p>$${formatNumber(dashboardData.totalExpenses || 0)}</p>
        </div>
        <div class="stat-card">
          <h3>Ventas del Período</h3>
          <p>${dashboardData.totalSales || 0}</p>
        </div>
        <div class="stat-card">
          <h3>Beneficio Neto</h3>
          <p>$${formatNumber((dashboardData.totalRevenue || 0) - (dashboardData.totalExpenses || 0))}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita ventanas emergentes para exportar el PDF');
    return;
  }

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
};

/**
 * Exporta inventario a Excel (CSV)
 */
export const exportInventoryToExcel = (
  materiasPrimas: any[],
  ingredientes: any[],
  productos: any[],
  filename: string = 'inventario.csv'
) => {
  // Crear CSV para Materias Primas
  let csvContent = 'MATERIAS PRIMAS\n';
  csvContent += 'ID,Nombre,Tipo Ingrediente,Unidad,Stock,Descripción\n';
  materiasPrimas.forEach(m => {
    csvContent += `${m.id},${escapeCSV(m.nombre)},${escapeCSV(m.tipo_ingrediente || '')},${m.unidad_medida},${m.stock_disponible},${escapeCSV(m.descripcion || '')}\n`;
  });

  csvContent += '\n\nINGREDIENTES\n';
  csvContent += 'ID,Nombre,Tipo,Porción Estándar,Unidad,Valor Extra (CLP),Descripción\n';
  ingredientes.forEach(i => {
    csvContent += `${i.id_ingrediente},${escapeCSV(i.nombre)},${i.tipo},${i.porcion_estandar},${i.unidad},${i.valor_extra_clp},${escapeCSV(i.descripcion || '')}\n`;
  });

  csvContent += '\n\nPRODUCTOS\n';
  csvContent += 'ID,Nombre,Categoría,Tipo,Precio Base (CLP),Precio (CLP),Descripción\n';
  productos.forEach(p => {
    const precio = p.tipo === 'configurable' ? p.precio_base_clp : p.precio_clp;
    csvContent += `${p.id},${escapeCSV(p.nombre)},${p.categoria},${p.tipo},${precio || ''},${p.tipo === 'no_configurable' ? precio : ''},${escapeCSV(p.descripcion || '')}\n`;
  });

  // Crear blob y descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Formatea un número con separadores de miles
 */
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-CL').format(Math.round(num));
};

/**
 * Escapa valores para CSV
 */
const escapeCSV = (value: string): string => {
  if (!value) return '';
  // Si el valor contiene comas, comillas o saltos de línea, envolverlo en comillas
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};


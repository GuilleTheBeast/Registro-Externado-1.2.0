import { Controller, Get, Header,  HttpException, HttpStatus, Query } from '@nestjs/common';
import { ExternadoStudentPeriodService } from 'src/externado_student_period/externado_student_period.service';
import { StreamableFile } from '@nestjs/common';
//import * as XLSX from 'xlsx'; 
import * as XLSX from 'xlsx-js-style';
import * as fs from 'fs';


@Controller('sheetjs')
export class SheetjsController {
  constructor(private readonly studentPeriod: ExternadoStudentPeriodService) {}
 
  @Get('download')
  @Header('Content-Disposition', 'attachment; filename="Matricula.xlsx"')
  async downloadStudentsAsXlsx(@Query('level') level?: string, @Query('period') period?: string): Promise<StreamableFile> {
    // Obtener datos de la base de datos
    const students = await this.studentPeriod.getStudentPeriods(level, period);
  // Verificar si hay registros
  if (!students || students.length === 0) {
    throw new HttpException('No se encontraron registros', HttpStatus.NOT_FOUND);
  }
    // Convertir los datos a un formato compatible con xlsx
    const jsonData = students.map(students => ({
      'Apellidos':students.externado_student_lastname,
      'Nombres':students.externado_student_firstname, 
      'Grado':students.externado_level,
      'Periodo matricula':students.externado_range_period,
      'Telefono':students.externado_student_phone,
      'Correo':students.externado_student_email,
      'Lugar nacimiento':students.externado_student_birthplace,
      'Fecha nacimiento':students.externado_student_birthdate,
      'Nacionalidad':students.externado_student_nationality,
      'Departamento':students.externado_department,
      'Ciudad':students.externado_student_town,  
      'Direccion':students.externado_student_address,
      'Anterior escuela':students.externado_student_last_school,
      'Emergencia nombre':students.externado_student_emergency_name,
      'Emergencia parentesco':students.externado_student_emergency_relationship,
      'Emergencia dirección':students.externado_student_emergency_address,
      'Emergencia telefono':students.externado_student_emergency_phone,
     }));

   // Escribir los datos en un archivo JSON
   fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2), 'utf8');

  // Leer el archivo JSON
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));    

  // Crear la hoja de cálculo a partir del JSON
  const ws = XLSX.utils.json_to_sheet(data);

  // Aplicar estilos a los encabezados
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } }, // Color de fuente blanco
    fill: { fgColor: { rgb: "4caf50" } }, // Color de fondo verde
    border: { top: { style: 'none' }, left: { style: 'none' }, bottom: { style: 'none' }, right: { style: 'none' } } // Establecer borde a ninguno
  };

   // Obtener rango de celdas de los encabezados
  let range = XLSX.utils.decode_range(ws['!ref']);

   // Asegurar que el rango incluya las celdas necesarias
  if (!range) {
    // Si el rango es undefined, crear un nuevo rango que incluya las celdas
    range = { s: { r: 0, c: 0 }, e: { r: data.length, c: Object.keys(data[0]).length - 1 } };
  }

 // Aplicar estilos a los encabezados (fila A5)
for (let col = range.s.c; col <= range.e.c; col++) {
  const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
  ws[cellAddress].s = headerStyle;
}

    // Crear un libro de trabajo y agregar la hoja de cálculo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Matriculas');

    // Generar el archivo xlsx como un buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Devolver el archivo como una respuesta streamable
    return new StreamableFile(buf);
  }
}

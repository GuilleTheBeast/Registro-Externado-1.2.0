import { Controller, Get, Header, UseGuards,Req } from '@nestjs/common';
import { ExternadoStudentService } from '../externado_student/externado_student.service';
import { StreamableFile } from '@nestjs/common';
//import * as XLSX from 'xlsx'; 
import * as XLSX from 'xlsx-js-style';
import * as fs from 'fs';


@Controller('sheetjs')
export class SheetjsController {
  constructor(private readonly studentService: ExternadoStudentService) {}

  @Get('download')
  @Header('Content-Disposition', 'attachment; filename="Matricula.xlsx"')
  async downloadStudentsAsXlsx(): Promise<StreamableFile> {
    // Obtener datos de la base de datos
    const students = await this.studentService.getStudents();

    // Convertir los datos a un formato compatible con xlsx
    const jsonData = students.map(students => ({
       'Id':students.idexternado_student, 
       'Nombre':students.externado_student_firstname, 
       'Apellidos':students.externado_student_lastname, 
       'Lugar de nacimiento':students.externado_student_birthplace, 
       'Fecha de nacimiento':students.externado_student_birthdate,
       'Nacionalidad':students.externado_student_nationality,
       'Género':students.externado_student_gender,
       'Direccion':students.externado_student_address,
       'Municipio':students.externado_student_town,
       'Celular de estudiante':students.externado_student_phone,
       'Correo de estudiante':students.externado_student_email,
       'Anterior escuela':students.externado_student_last_school,
       'Grado a cursar':students.externado_student_current_level_id,
       'Hermanos estudiando en el colegio':students.externado_student_has_siblings,
       'Nombre de hermano':students.externado_student_siblings,
       'Vive con padres':students.externado_student_lives_with_parents,
       'Con quién vive':students.externado_student_lives_with_who,
       'Parentesco con estudiante':students.externado_student_lives_with_related,
       'Dirección donde viven':students.externado_student_lives_with_address,
       'Católico':students.externado_student_catholic,
       'Otra iglesia':students.externado_student_church_other,
       'Emergencia llamar a':students.externado_student_emergency_name,
       'Parentesco emergencia':students.externado_student_emergency_relationship,
       'Direccion emergencia':students.externado_student_emergency_address,
       'celular emergencia':students.externado_student_emergency_phone,
       'Finalizo llenado':students.externado_proccess_finished,
       'Activo':students.externado_student_active,
       'Fecha llenado':students.externado_creation_datetime
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

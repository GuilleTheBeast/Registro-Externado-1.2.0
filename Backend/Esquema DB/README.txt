En el archivo "externadodb_DDL.sql" va toda la estructura de la base de datos necesaria para que el sistema de matrícula del 
Externado de San José pueda se utilizado. Dentro de este archivo se encuentran tablas catálogos, tabla de sequencias y tablas 
de información directa del sistema.

Parte de las cosas necesarias para el buen funcionamiento e iniciación del sistema es:
	-Tener todas las sequencias colocadas al valor indicado en el DDL (Si el valor indica "2" es porque el siguiente registro 
		a crearse será el número "2" y él solo aumentará a "3")
		
	-Tener un primer registro dentro de la tabla "externado_user" y "externado_admin" el cual será el "Super Administrador", para 
		el caso se ha dejado "matricula@externado.edu.sv" con contraseña "matricula" (se ha colocado tambien este comentario 
		dentro del DDL). Es de confirmar con el externado si dicho correo existe y lo manejan ellos, ya que para poder cambiar la 
		contraseña existe el metodo normal de "¿Olvidaste tu contraseña?" del mismo aplicativo, pero este lo que hará es enviar un correo
		al correo del usuario (valga la redundancia) con la nueva contraseña, por tanto se debe de tener acceso al correo mencionado
		
	-No existe un método de creación o asignación del rol "Super Administrador", la idea es que sea un único usuario. Si se
		desea crear más de uno, se deberá hacer la asignación del rol a nivel de BD despues de crear un usuario con el proceso normal
		
	-Cada usuario nuevo que se cree, se creará con el rol "Responsable" (que sería para los padres de familia), es parte 
		de las actividades del "Super Administrador" asignar roles "Administrador" a los usuarios tipo "Responsable"
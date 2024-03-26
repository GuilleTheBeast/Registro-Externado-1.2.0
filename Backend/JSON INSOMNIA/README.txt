Se colocan todos los Endpoints funcionales del sistema de Matrícula del Externado.

Todo método que requiera un JSON de entrada, ya posee dicha estructura al abrir el Endpoint.

Para las pruebas, se han colocado 2 variables globales:
	-localhost: que de momento posee el valor "http://localhost:3001/api/v1/"
	
	-token: Donde se deberá colocar el valor devuelto por el endpoint "Login" después de un logueo exitoso. Una vez colocado
		el valor del token válido, se podrá usar cualquier otro método que requiera token
import '../css/formcliente.css'
import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import clientesService from "../services/clientesService";

const FormCliente = () => {

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [ciudad, setCiudad] = useState("");

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [errores, setErrores] = useState({});

    const validarCampos = () => {
        const nuevosErrores = {};
        if (nombre.trim() === "") nuevosErrores.nombre = "El nombre es obligatorio.";
        if (email.trim() === "") nuevosErrores.email = "El email es obligatorio.";
        if (ciudad.trim() === "") nuevosErrores.ciudad = "La ciudad es obligatoria.";
        
        // (Tu regex del H-04 sigue adentro del manejarSubmit, lo dejamos ahí)
        
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0; // Devuelve true si no hay errores
    };
    
    const manejarSubmit = async (e) => {

        e.preventDefault();

        setMensaje("");
        setError("");

        if (
            nombre.trim() === "" ||
            email.trim() === "" ||
            telefono.trim() === "" ||
            ciudad.trim() === ""
        ) {

            setError("Complete todos los campos.");

            return;
        }

        const telefonoRegex = /^\+?[0-9\s\-]{8,15}$/;

        if (!telefonoRegex.test(telefono.trim())) {
            setErrores(prev => ({ ...prev, telefono: "El número de teléfono es inválido. Use solo números (8 a 15 dígitos), guiones o un '+' inicial." }));
            return;
        }

        const nuevoCliente = {

            email,

            username: nombre.toLowerCase().replace(/\s/g, ""),

            password: "1234",

            name: {
                firstname: nombre,
                lastname: "-"
            },

            address: {
                city: ciudad
            },

            phone: telefono
        };

        try {

            setLoading(true);

            const respuesta =
                await clientesService.crearCliente(
                    nuevoCliente
                );

            setMensaje(
                `Cliente creado correctamente. ID: ${respuesta.id}`
            );

            setNombre("");
            setEmail("");
            setTelefono("");
            setCiudad("");

        } catch {

            setError(
                "Ocurrió un error al crear el cliente."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className='formulario-cliente'>

            <h3>Nuevo Cliente</h3>

            <Form onSubmit={manejarSubmit}>

                <Form.Group className="mb-3">

                    <Form.Label>Nombre</Form.Label>

                    <Form.Control
                        type="text"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
                    />

                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Label>Email</Form.Label>

                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Label>Teléfono</Form.Label>

                    <Form.Control
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        pattern="^\+?[0-9\s\-]{8,15}$"
                        title="Debe contener entre 8 y 15 números. Puede incluir espacios, guiones o un '+' al inicio."
                    />

                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Label>Ciudad</Form.Label>

                    <Form.Control
                        type="text"
                        value={ciudad}
                        onChange={(e) =>
                            setCiudad(e.target.value)
                        }
                    />

                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                >

                    {
                        loading
                            ? <Spinner size="sm" />
                            : "Guardar Cliente"
                    }

                </Button>

            </Form>

            {
                mensaje &&
                <Alert
                    className="mt-3"
                    variant="success"
                >
                    {mensaje}
                </Alert>
            }

            {
                error &&
                <Alert
                    className="mt-3"
                    variant="danger"
                >
                    {error}
                </Alert>
            }

        </div>

    );
};

export default FormCliente;
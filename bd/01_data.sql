INSERT INTO categories (name, description) VALUES 
('Fontanería', 'Servicios de fontanería incluyendo reparaciones, instalaciones y mantenimiento'),
('Electricidad', 'Trabajos eléctricos incluyendo cableado, reparaciones e instalaciones'),
('Carpintería', 'Servicios de carpintería y ebanistería'),
('Limpieza', 'Servicios de limpieza residencial y comercial'),
('Jardinería', 'Servicios de paisajismo y jardinería'),
('Pintura', 'Servicios de pintura interior y exterior'),
('Reparaciones', 'Servicios generales de reparación'),
('Desarrollo', 'Servicios de desarrollo de software y TI'),
('Otros', 'Otros tipos de servicios');

-- Todos los valores de contraseña son "contraseña"

INSERT INTO users (email, password, first_name, last_name, phone, address, role, years_experience, specialty, professional_description) VALUES
('marcos.gonzalez@gmail.com', '$2a$10$b2.c5ImGd8w/7fF1g4ohh.Q6K15TVko6XyfOlZUYE7V46DBYkFqpe', 'Marcos', 'González', '098123456', 'Av. 18 de Julio 1234, Montevideo', 'SELLER', 8, 'Fontanero certificado', 'Especialista en sistemas hidráulicos con 8 años de experiencia. Trabajos garantizados y atención las 24 horas para emergencias.'),
('lucia.fernandez@gmail.com', '$2a$10$b2.c5ImGd8w/7fF1g4ohh.Q6K15TVko6XyfOlZUYE7V46DBYkFqpe', 'Lucía', 'Fernández', '091234567', 'Colonia 567, Montevideo', 'SELLER', 5, 'Electricista industrial', 'Electricista matriculada con experiencia en instalaciones residenciales e industriales. Cumplimiento de normas UNIT.'),
('carlos.mendez@hotmail.com', '$2a$10$b2.c5ImGd8w/7fF1g4ohh.Q6K15TVko6XyfOlZUYE7V46DBYkFqpe', 'Carlos', 'Méndez', '099345678', 'Rivera 890, Salto', 'SELLER', 12, 'Maestro carpintero', 'Carpintero con amplia experiencia en muebles a medida y restauración. Trabajos de calidad premium.'),
('ana.pereyra@gmail.com', '$2a$10$b2.c5ImGd8w/7fF1g4ohh.Q6K15TVko6XyfOlZUYE7V46DBYkFqpe', 'Ana', 'Pereyra', '095456789', 'Bvar. Artigas 321, Paysandú', 'SELLER', 3, 'Limpieza profesional', 'Servicios de limpieza con productos ecológicos. Especialista en limpieza post-obra y mudanzas.'),
('jorge.silva@gmail.com', '$2a$10$b2.c5ImGd8w/7fF1g4ohh.Q6K15TVko6XyfOlZUYE7V46DBYkFqpe', 'Jorge', 'Silva', '093567890', 'Av. Italia 654, Maldonado', 'SELLER', 7, 'Landscaper profesional', 'Diseño y mantenimiento de jardines. Especialista en sistemas de riego automatizado.'),
('mariana.rodriguez@hotmail.com', '$2a$10$b2.c5ImGd8w/7fF1g4ohh.Q6K15TVko6XyfOlZUYE7V46DBYkFqpe', 'Mariana', 'Rodríguez', '092678901', 'Tacuarembó 234, Rivera', 'SELLER', 4, 'Desarrolladora web', 'Desarrollo de sitios web y aplicaciones. Especialista en React y Node.js.');

INSERT INTO users (email, password, first_name, last_name, phone, role) VALUES
('admin@superservice.uy', '$2a$10$b2.c5ImGd8w/7fF1g4ohh.Q6K15TVko6XyfOlZUYE7V46DBYkFqpe', 'ADMIN', 'Sistema', '091111111', 'ADMIN');

INSERT INTO services (seller_id, title, description, category_id, base_price, price_type, estimated_time, materials_included) VALUES
(1, 'Reparación de pérdidas de agua', 'Solución urgente para fugas en cañerías, grifería y sanitarios. Servicio disponible 24/7.', 1, 1200.00, 'per_hour', '1-3 horas', 'Incluye materiales básicos de reparación'),
(1, 'Instalación de termotanque', 'Colocación profesional de termotanques eléctricos y a gas con garantía.', 1, 3500.00, 'per_project', '2-4 horas', 'No incluye el termotanque'),
(2, 'Instalación de tablero eléctrico', 'Montaje completo de tablero principal con disyuntores diferenciales.', 2, 2800.00, 'per_project', '3-5 horas', 'Incluye cables y disyuntores básicos'),
(2, 'Reparación de cortocircuitos', 'Diagnóstico y solución de problemas eléctricos en toda la instalación.', 2, 950.00, 'per_hour', '1-2 horas', 'Incluye materiales de seguridad'),
(3, 'Mueble de cocina a medida', 'Diseño y construcción de muebles de cocina personalizados según medidas.', 3, 15000.00, 'per_project', '10-15 días', 'Incluye madera de primera calidad y herrajes'),
(3, 'Reparación de muebles antiguos', 'Restauración profesional de muebles de valor sentimental o antigüedades.', 3, 1200.00, 'per_hour', 'Varía según el trabajo', 'Incluye barnices y materiales de restauración'),
(4, 'Limpieza profunda post-obra', 'Limpieza completa después de trabajos de construcción o remodelación.', 4, 4500.00, 'per_project', '6-8 horas', 'Incluye productos profesionales y equipos'),
(4, 'Limpieza mensual de oficina', 'Mantenimiento regular para oficinas de hasta 100m².', 4, 2200.00, 'per_month', '3-4 horas por visita', 'Incluye productos de limpieza'),
(5, 'Diseño de jardín completo', 'Proyecto integral de jardín con selección de plantas y sistema de riego.', 5, 12000.00, 'per_project', '7-10 días', 'Incluye plantas básicas y diseño'),
(5, 'Mantenimiento de jardín quincenal', 'Cuidado regular incluyendo poda, riego y control de plagas.', 5, 1800.00, 'per_month', '2 visitas al mes', 'Incluye fertilizantes y productos fitosanitarios'),
(6, 'Desarrollo de sitio web', 'Creación de sitio web responsive con CMS personalizado.', 8, 25000.00, 'per_project', '3-4 semanas', 'Incluye dominio y hosting por 1 año');

INSERT INTO service_images (service_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39'),
(1, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952'),
(3, 'https://images.unsplash.com/photo-1621905251918-48416bd8575a'),
(5, 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b'),
(5, 'https://images.unsplash.com/photo-1617806118233-18e1de247200'),
(7, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952'),
(9, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b'),
(11, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085');

INSERT INTO seller_portfolios (seller_id, image_url, description, is_featured) VALUES
(1, 'https://ejemplo.com/portfolio/juan1.jpg', 'Instalación completa de baño moderno', true),
(1, 'https://ejemplo.com/portfolio/juan2.jpg', 'Reparación de cañería principal', false),
(2, 'https://ejemplo.com/portfolio/maria1.jpg', 'Instalación eléctrica en edificio', true),
(3, 'https://ejemplo.com/portfolio/carlos1.jpg', 'Mueble de cocina personalizado', true),
(3, 'https://ejemplo.com/portfolio/carlos2.jpg', 'Restauración de mesa antigua', true),
(5, 'https://ejemplo.com/portfolio/pedro1.jpg', 'Jardín residencial diseñado', true);

INSERT INTO contact_requests (service_id, client_first_name, client_last_name, client_email, client_phone, task_description, status, unique_rating_token, rating_token_expires_at) VALUES
(1, 'Fernando', 'López', 'fernando.lopez@gmail.com', '098765432', 'Tengo una fuga en el baño principal que está mojando el piso de abajo. Necesito solución urgente.', 'COMPLETED', 'rating_token_12345', CURRENT_TIMESTAMP + INTERVAL '30 days'),
(1, 'María', 'García', 'maria.garcia@hotmail.com', '091234567', 'El calefón no calienta bien el agua. Parece que hay una obstrucción en las cañerías.', 'SEEN', 'rating_token_67890', CURRENT_TIMESTAMP + INTERVAL '30 days'),
(3, 'Roberto', 'Martínez', 'roberto.martinez@adinet.com.uy', '099888777', 'Necesito instalar un tablero nuevo en mi casa que está en construcción.', 'IN_PROCESS', 'rating_token_11111', CURRENT_TIMESTAMP + INTERVAL '30 days'),
(5, 'Sofía', 'Hernández', 'sofia.hernandez@correo.com.uy', '097654321', 'Quiero un mueble de TV de 2 metros con estantes para equipos de sonido.', 'NEW', 'rating_token_22222', CURRENT_TIMESTAMP + INTERVAL '30 days'),
(7, 'Diego', 'Pérez', 'diego.perez@outlook.com', '096543219', 'Acabamos de terminar una reforma y necesitamos limpieza profunda antes de mudarnos.', 'COMPLETED', 'rating_token_33333', CURRENT_TIMESTAMP + INTERVAL '30 days');

INSERT INTO ratings (contact_request_id, service_id, seller_id, rating, review_text) VALUES
(1, 1, 1, 5, 'Excelente servicio! Marcos llegó puntual, identificó el problema rápidamente y lo solucionó con profesionalismo. Muy recomendable.'),
(5, 7, 4, 4, 'Ana hizo un trabajo impecable. Muy detallista y cuidadosa. El único detalle fue que llegó 20 minutos tarde, pero el trabajo fue excelente.');


INSERT INTO content_reports (service_id, reporter_email, reason, details) VALUES
(2, 'usuario.testeo@gmail.com', 'FALSE_INFORMATION', 'El vendedor afirma tener certificaciones que no pudo demostrar cuando se le preguntó.'),
(8, 'cliente.pesado@hotmail.com', 'SPAM', 'Este servicio aparece publicado con variaciones mínimas 5 veces en la plataforma.');

INSERT INTO moderation_actions (admin_id, service_id, seller_id, action_type, justification, internal_notes) VALUES
(7, 2, 1, 'APPROVE_SERVICE', 'El vendedor presentó documentación que respalda sus certificaciones', 'Se verificaron los documentos y son válidos'),
(7, NULL, 2, 'SUSPEND_SELLER', 'Múltiples reportes de clientes por cobros adicionales no acordados', 'Suspensión por 15 días para investigación');

INSERT INTO admin_notifications (seller_id, moderation_action_id, title, message) VALUES
(1, 1, 'Servicio aprobado', 'Tu servicio "Instalación de un marco de madera nuevo" ha sido aprobado después de revisión.'),
(2, 2, 'Cuenta suspendida temporalmente', 'Tu cuenta ha sido suspendida por 7 días debido a reportes de usuarios. Por favor contacta al soporte.');

INSERT INTO user_sessions (user_id, token, expires_at) VALUES
(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5OTAyMzQ0NCwiZXhwIjoxNjk5MTA5ODQ0fQ', CURRENT_TIMESTAMP + INTERVAL '7 days'),
(2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY5OTAyMzQ0NCwiZXhwIjoxNjk5MTA5ODQ0fQ', CURRENT_TIMESTAMP + INTERVAL '7 days');


-- Actualizar estadísticas de vendedores
UPDATE users SET 
    average_rating = 5.0,
    total_completed_jobs = 12,
    last_job_date = CURRENT_TIMESTAMP - INTERVAL '5 days'
WHERE id = 1;

UPDATE users SET 
    average_rating = 4.2,
    total_completed_jobs = 8,
    last_job_date = CURRENT_TIMESTAMP - INTERVAL '10 days'
WHERE id = 4;
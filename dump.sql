--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Ubuntu 17.2-1.pgdg24.04+1)
-- Dumped by pg_dump version 17.2 (Ubuntu 17.2-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: jud
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO jud;

--
-- Name: attachment; Type: TABLE; Schema: public; Owner: jud
--

CREATE TABLE public.attachment (
    attachment_id bigint NOT NULL,
    mime_type character varying(50) NOT NULL,
    file_size_bytes integer NOT NULL,
    file_path text NOT NULL,
    sha256 character varying(64) NOT NULL,
    prescription_id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.attachment OWNER TO jud;

--
-- Name: attachment_attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: jud
--

CREATE SEQUENCE public.attachment_attachment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attachment_attachment_id_seq OWNER TO jud;

--
-- Name: attachment_attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jud
--

ALTER SEQUENCE public.attachment_attachment_id_seq OWNED BY public.attachment.attachment_id;


--
-- Name: medication; Type: TABLE; Schema: public; Owner: jud
--

CREATE TABLE public.medication (
    medication_id bigint NOT NULL,
    name character varying(100) NOT NULL,
    brand_name character varying(100),
    short_description text,
    form character varying(50),
    base_dosage character varying(50),
    expiration_date date,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.medication OWNER TO jud;

--
-- Name: medication_medication_id_seq; Type: SEQUENCE; Schema: public; Owner: jud
--

CREATE SEQUENCE public.medication_medication_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medication_medication_id_seq OWNER TO jud;

--
-- Name: medication_medication_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jud
--

ALTER SEQUENCE public.medication_medication_id_seq OWNED BY public.medication.medication_id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: jud
--

CREATE TABLE public.notification (
    notif_id bigint NOT NULL,
    notif_type character varying(50) NOT NULL,
    content text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.notification OWNER TO jud;

--
-- Name: notification_notif_id_seq; Type: SEQUENCE; Schema: public; Owner: jud
--

CREATE SEQUENCE public.notification_notif_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_notif_id_seq OWNER TO jud;

--
-- Name: notification_notif_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jud
--

ALTER SEQUENCE public.notification_notif_id_seq OWNED BY public.notification.notif_id;


--
-- Name: prescription; Type: TABLE; Schema: public; Owner: jud
--

CREATE TABLE public.prescription (
    prescription_id bigint NOT NULL,
    title character varying(100),
    prescriber character varying(100),
    notes text,
    user_id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.prescription OWNER TO jud;

--
-- Name: prescription_line; Type: TABLE; Schema: public; Owner: jud
--

CREATE TABLE public.prescription_line (
    line_id bigint NOT NULL,
    start_date date NOT NULL,
    end_date date,
    dose numeric(10,3),
    unit character varying(20),
    frequency_day integer,
    instructions text,
    status character varying(20),
    prescription_id bigint NOT NULL,
    medication_id bigint,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.prescription_line OWNER TO jud;

--
-- Name: prescription_line_line_id_seq; Type: SEQUENCE; Schema: public; Owner: jud
--

CREATE SEQUENCE public.prescription_line_line_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescription_line_line_id_seq OWNER TO jud;

--
-- Name: prescription_line_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jud
--

ALTER SEQUENCE public.prescription_line_line_id_seq OWNED BY public.prescription_line.line_id;


--
-- Name: prescription_prescription_id_seq; Type: SEQUENCE; Schema: public; Owner: jud
--

CREATE SEQUENCE public.prescription_prescription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescription_prescription_id_seq OWNER TO jud;

--
-- Name: prescription_prescription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jud
--

ALTER SEQUENCE public.prescription_prescription_id_seq OWNED BY public.prescription.prescription_id;


--
-- Name: refresh_token; Type: TABLE; Schema: public; Owner: jud
--

CREATE TABLE public.refresh_token (
    token_id bigint NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    device_info character varying(100),
    user_id bigint NOT NULL
);


ALTER TABLE public.refresh_token OWNER TO jud;

--
-- Name: refresh_token_token_id_seq; Type: SEQUENCE; Schema: public; Owner: jud
--

CREATE SEQUENCE public.refresh_token_token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_token_token_id_seq OWNER TO jud;

--
-- Name: refresh_token_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jud
--

ALTER SEQUENCE public.refresh_token_token_id_seq OWNED BY public.refresh_token.token_id;


--
-- Name: reset_password; Type: TABLE; Schema: public; Owner: jud
--

CREATE TABLE public.reset_password (
    reset_id bigint NOT NULL,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    is_used boolean DEFAULT false NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.reset_password OWNER TO jud;

--
-- Name: reset_password_reset_id_seq; Type: SEQUENCE; Schema: public; Owner: jud
--

CREATE SEQUENCE public.reset_password_reset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reset_password_reset_id_seq OWNER TO jud;

--
-- Name: reset_password_reset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jud
--

ALTER SEQUENCE public.reset_password_reset_id_seq OWNED BY public.reset_password.reset_id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: jud
--

CREATE TABLE public."user" (
    user_id bigint NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password text NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."user" OWNER TO jud;

--
-- Name: user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: jud
--

CREATE SEQUENCE public.user_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_user_id_seq OWNER TO jud;

--
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jud
--

ALTER SEQUENCE public.user_user_id_seq OWNED BY public."user".user_id;


--
-- Name: attachment attachment_id; Type: DEFAULT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.attachment ALTER COLUMN attachment_id SET DEFAULT nextval('public.attachment_attachment_id_seq'::regclass);


--
-- Name: medication medication_id; Type: DEFAULT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.medication ALTER COLUMN medication_id SET DEFAULT nextval('public.medication_medication_id_seq'::regclass);


--
-- Name: notification notif_id; Type: DEFAULT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.notification ALTER COLUMN notif_id SET DEFAULT nextval('public.notification_notif_id_seq'::regclass);


--
-- Name: prescription prescription_id; Type: DEFAULT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.prescription ALTER COLUMN prescription_id SET DEFAULT nextval('public.prescription_prescription_id_seq'::regclass);


--
-- Name: prescription_line line_id; Type: DEFAULT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.prescription_line ALTER COLUMN line_id SET DEFAULT nextval('public.prescription_line_line_id_seq'::regclass);


--
-- Name: refresh_token token_id; Type: DEFAULT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.refresh_token ALTER COLUMN token_id SET DEFAULT nextval('public.refresh_token_token_id_seq'::regclass);


--
-- Name: reset_password reset_id; Type: DEFAULT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.reset_password ALTER COLUMN reset_id SET DEFAULT nextval('public.reset_password_reset_id_seq'::regclass);


--
-- Name: user user_id; Type: DEFAULT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public."user" ALTER COLUMN user_id SET DEFAULT nextval('public.user_user_id_seq'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: jud
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250810182029-create-user.js
\.


--
-- Data for Name: attachment; Type: TABLE DATA; Schema: public; Owner: jud
--

COPY public.attachment (attachment_id, mime_type, file_size_bytes, file_path, sha256, prescription_id, created_at) FROM stdin;
\.


--
-- Data for Name: medication; Type: TABLE DATA; Schema: public; Owner: jud
--

COPY public.medication (medication_id, name, brand_name, short_description, form, base_dosage, expiration_date, created_at, updated_at) FROM stdin;
1	Paracétamol	\N	\N	Comprimé	500 mg	\N	2025-08-29 11:20:43.022+02	2025-08-29 11:20:43.022+02
2	Ibuprofène	\N	\N	Comprimé	200 mg	\N	2025-08-29 11:20:43.022+02	2025-08-29 11:20:43.022+02
3	Amoxicilline	\N	\N	Gélule	1 g	\N	2025-08-29 11:20:43.022+02	2025-08-29 11:20:43.022+02
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: jud
--

COPY public.notification (notif_id, notif_type, content, is_read, user_id, created_at, updated_at) FROM stdin;
2	INFO	Nouveau médicament disponible.	f	3	2025-08-29 11:20:43.079+02	2025-08-29 11:20:43.079+02
\.


--
-- Data for Name: prescription; Type: TABLE DATA; Schema: public; Owner: jud
--

COPY public.prescription (prescription_id, title, prescriber, notes, user_id, created_at, updated_at) FROM stdin;
3	Ordo Bob C	Dr. Strange	Fièvre	3	2025-08-29 11:20:43.044+02	2025-08-29 11:20:43.044+02
\.


--
-- Data for Name: prescription_line; Type: TABLE DATA; Schema: public; Owner: jud
--

COPY public.prescription_line (line_id, start_date, end_date, dose, unit, frequency_day, instructions, status, prescription_id, medication_id, created_at, updated_at) FROM stdin;
4	2025-08-29	2025-09-01	\N	\N	\N	\N	\N	3	1	2025-08-29 11:20:43.053+02	2025-08-29 11:20:43.053+02
\.


--
-- Data for Name: refresh_token; Type: TABLE DATA; Schema: public; Owner: jud
--

COPY public.refresh_token (token_id, token, created_at, expires_at, device_info, user_id) FROM stdin;
2	tokenBob	2025-08-29 11:20:43.086+02	2025-09-28 11:20:43.053+02	\N	3
\.


--
-- Data for Name: reset_password; Type: TABLE DATA; Schema: public; Owner: jud
--

COPY public.reset_password (reset_id, token, expires_at, created_at, is_used, user_id) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: jud
--

COPY public."user" (user_id, first_name, last_name, email, password, role, created_at, updated_at) FROM stdin;
1	Admin	Test	admin@example.com	$argon2id$v=19$m=65536,t=3,p=4$znmtXUc4msQl2mpn+dBxUw$J0V7HOGWDukGhz7zaSCJd7Xkfm42I5j1r9ZxMRH6EUI	ADMIN	2025-08-29 11:20:43.003+02	2025-08-29 11:20:43.003+02
3	Bob	Martin	bob@example.com	$argon2id$v=19$m=65536,t=3,p=4$znmtXUc4msQl2mpn+dBxUw$J0V7HOGWDukGhz7zaSCJd7Xkfm42I5j1r9ZxMRH6EUI	USER	2025-08-29 11:20:43.017+02	2025-08-29 11:20:43.017+02
\.


--
-- Name: attachment_attachment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jud
--

SELECT pg_catalog.setval('public.attachment_attachment_id_seq', 2, true);


--
-- Name: medication_medication_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jud
--

SELECT pg_catalog.setval('public.medication_medication_id_seq', 3, true);


--
-- Name: notification_notif_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jud
--

SELECT pg_catalog.setval('public.notification_notif_id_seq', 2, true);


--
-- Name: prescription_line_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jud
--

SELECT pg_catalog.setval('public.prescription_line_line_id_seq', 4, true);


--
-- Name: prescription_prescription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jud
--

SELECT pg_catalog.setval('public.prescription_prescription_id_seq', 3, true);


--
-- Name: refresh_token_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jud
--

SELECT pg_catalog.setval('public.refresh_token_token_id_seq', 2, true);


--
-- Name: reset_password_reset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jud
--

SELECT pg_catalog.setval('public.reset_password_reset_id_seq', 1, true);


--
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jud
--

SELECT pg_catalog.setval('public.user_user_id_seq', 3, true);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: attachment attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.attachment
    ADD CONSTRAINT attachment_pkey PRIMARY KEY (attachment_id);


--
-- Name: medication medication_pkey; Type: CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.medication
    ADD CONSTRAINT medication_pkey PRIMARY KEY (medication_id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (notif_id);


--
-- Name: prescription_line prescription_line_pkey; Type: CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.prescription_line
    ADD CONSTRAINT prescription_line_pkey PRIMARY KEY (line_id);


--
-- Name: prescription prescription_pkey; Type: CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.prescription
    ADD CONSTRAINT prescription_pkey PRIMARY KEY (prescription_id);


--
-- Name: refresh_token refresh_token_pkey; Type: CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT refresh_token_pkey PRIMARY KEY (token_id);


--
-- Name: refresh_token refresh_token_token_key; Type: CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT refresh_token_token_key UNIQUE (token);


--
-- Name: reset_password reset_password_pkey; Type: CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.reset_password
    ADD CONSTRAINT reset_password_pkey PRIMARY KEY (reset_id);


--
-- Name: reset_password reset_password_token_key; Type: CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.reset_password
    ADD CONSTRAINT reset_password_token_key UNIQUE (token);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- Name: attachment attachment_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.attachment
    ADD CONSTRAINT attachment_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescription(prescription_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification notification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: prescription_line prescription_line_medication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.prescription_line
    ADD CONSTRAINT prescription_line_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medication(medication_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: prescription_line prescription_line_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.prescription_line
    ADD CONSTRAINT prescription_line_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescription(prescription_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: prescription prescription_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.prescription
    ADD CONSTRAINT prescription_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_token refresh_token_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT refresh_token_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reset_password reset_password_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jud
--

ALTER TABLE ONLY public.reset_password
    ADD CONSTRAINT reset_password_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


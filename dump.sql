--
-- PostgreSQL database dump
--

-- Dumped from database version 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.records (
    id integer NOT NULL,
    "userId" integer,
    records text
);


ALTER TABLE public.records OWNER TO postgres;

--
-- Name: records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.records_id_seq OWNER TO postgres;

--
-- Name: records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.records_id_seq OWNED BY public.records.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    "userId" integer,
    token text
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sessions_id_seq OWNER TO postgres;

--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text,
    email text,
    password text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.records ALTER COLUMN id SET DEFAULT nextval('public.records_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.records (id, "userId", records) FROM stdin;
179	622	[{"date":"25/10","description":"Pedro","value":12,"isAddRecord":true},{"date":"25/10","description":"Mafra","value":6,"isAddRecord":false}]
185	639	[]
197	671	[]
180	623	[{"date":"25/10","description":"sdf","value":23,"isAddRecord":true}]
182	631	[]
188	647	[]
192	655	[]
194	663	[]
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, "userId", token) FROM stdin;
253	629	9a6a7dcd-ac0f-4afc-abd0-ed3be0349260
257	637	b934a0f8-3dfb-42cb-a31d-2824b55cf92d
261	645	6897fcc7-8ef9-4960-a098-773c3f88efbc
266	651	3391c81a-2192-45c0-96c5-920323aef718
269	662	8010f4a7-2bf9-40b4-a585-28bbd6110e34
273	669	786a875e-a4d9-48d5-bdfb-26df8d2f72bf
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password) FROM stdin;
622	pm	p@m.com	$2b$11$1vhwI6dkv1B1yMT20iqF8.D4vZrgy9tSTodQZOnT3CLX7.URIQel.
623	m	m@m.com	$2b$11$23x87adCX/EYGQ9k8AnDLOinmgATYe3VP6bTPeERp1SybrDwwSREq
631	PedroTerceiro	a5153789-7f06-4213-9603-452813b2e3a7@email.com	$2b$11$pqlYRdATTRD293s6v3QkVuoZo2rfcqcnnsm0ppLAlSaBzL7hKJTuC
639	PedroTerceiro	7d6e66d8-944c-4dca-972d-6050bad1f4ab@email.com	$2b$11$PFzmbAJDvL/bEPENk8zpCeRDO1Zf.5dtMENKMgdhnBeWuKB9ELEE.
647	PedroTerceiro	e66c3a18-c45c-473a-b008-cc118a42967f@email.com	$2b$11$kktLhF6ayIuNIYkKPJiJCuMLj/UKrlyzI0UXpaUPH1aW4L4EaLa8O
655	PedroTerceiro	68542469-ea0a-451e-aa89-ae74f0b89adf@email.com	$2b$11$yCXpwqYBpjui5HHrf88CLuGCv7v1qg/kYgNRPK73ueiDg7pka53dq
663	PedroTerceiro	cac6105c-8235-4726-a0ac-c125ce5b3aa4@email.com	$2b$11$BoHL0GKm1RIw9gh8.QWWjOLzEG6X6Rh8KtDvQ6/wKTyy8rsOj86g2
671	PedroTerceiro	ecf6c8b5-55ea-43ae-99b6-a3bb3552b476@email.com	$2b$11$JdPbLrnXsn/Z97Vln1DVMuCmy/Jp4vRS/tDnIT1J9G4fNWXNmJ20q
\.


--
-- Name: records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.records_id_seq', 198, true);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sessions_id_seq', 275, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 671, true);


--
-- PostgreSQL database dump complete
--


ALTER TABLE t_p16974247_cjplfnm_cfqn_liz.settings 
ADD CONSTRAINT unique_key UNIQUE (key);

INSERT INTO t_p16974247_cjplfnm_cfqn_liz.settings (key, value) 
VALUES ('challonge_url', '')
ON CONFLICT (key) DO NOTHING;

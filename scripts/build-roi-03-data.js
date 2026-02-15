#!/usr/bin/env node
/**
 * Build ROI-03-program-term.json and ROI-03-program-year.json from TSV data
 */
const fs = require('fs');
const path = require('path');

const PROGRAM_TERM_TSV = `Academic_Year	Term	College	Program_ID	Program_Name	total_revenue	total_cost	ROI03_Program_Margin_AED	ROI03_Program_Margin_Pct
2019-20	Fall	Business	P001	Management Program 1	647511	617986.9394	29524.06	4.56
2019-20	Fall	Business	P002	Management Program 2	637488	555576.3772	81911.62	12.85
2019-20	Fall	Business	P003	Finance Program 1	702090	640014.1967	62075.8	8.84
2019-20	Fall	Business	P004	Finance Program 2	548742	521311.7549	27430.25	5
2019-20	Fall	Business	P005	Marketing Program 1	770178	517640.5453	252537.45	32.79
2019-20	Fall	Business	P006	Marketing Program 2	540316	482152.1864	58163.81	10.76
2019-20	Fall	Computing	P013	Computer Science Program 1	639568	509526.5499	130041.45	20.33
2019-20	Fall	Computing	P014	Computer Science Program 2	673751	701883.8353	-28132.84	-4.18
2019-20	Fall	Computing	P015	Data Science Program 1	530267	606439.3807	-76172.38	-14.36
2019-20	Fall	Computing	P016	Data Science Program 2	386379	465475.2631	-79096.26	-20.47
2019-20	Fall	Computing	P017	Cybersecurity Program 1	418749	464006.8869	-45257.89	-10.81
2019-20	Fall	Computing	P018	Cybersecurity Program 2	520369	550641.0841	-30272.08	-5.82
2019-20	Fall	Engineering	P007	Civil Program 1	673170	594255.7701	78914.23	11.72
2019-20	Fall	Engineering	P008	Civil Program 2	656628	611461.3938	45166.61	6.88
2019-20	Fall	Engineering	P009	Mechanical Program 1	810213	706754.0785	103458.92	12.77
2019-20	Fall	Engineering	P010	Mechanical Program 2	628213	375876.7009	252336.3	40.17
2019-20	Fall	Engineering	P011	Electrical Program 1	572398	467198.8571	105199.14	18.38
2019-20	Fall	Engineering	P012	Electrical Program 2	575657	514845.1995	60811.8	10.56
2019-20	Fall	Health Sciences	P019	Nursing Program 1	725263	485362.5835	239900.42	33.08
2019-20	Fall	Health Sciences	P020	Nursing Program 2	637261	608097.9494	29163.05	4.58
2019-20	Fall	Health Sciences	P021	Public Health Program 1	683773	697360.0337	-13587.03	-1.99
2019-20	Fall	Health Sciences	P022	Public Health Program 2	976820	913541.6442	63278.36	6.48
2019-20	Fall	Health Sciences	P023	Pharmacy Program 1	1457581	813121.7993	644459.2	44.21
2019-20	Fall	Health Sciences	P024	Pharmacy Program 2	648956	617860.9899	31095.01	4.79
2019-20	Fall	Humanities	P025	Psychology Program 1	584119	477340.4615	106778.54	18.28
2019-20	Fall	Humanities	P026	Psychology Program 2	734816	656496.5216	78319.48	10.66
2019-20	Fall	Humanities	P027	Education Program 1	546474	508017.869	38456.13	7.04
2019-20	Fall	Humanities	P028	Education Program 2	498843	408623.0686	90219.93	18.09
2019-20	Fall	Humanities	P029	Media Program 1	795673	479794.6541	315878.35	39.7
2019-20	Fall	Humanities	P030	Media Program 2	713977	655269.4253	58707.57	8.22
2019-20	Spring	Business	P001	Management Program 1	716711	634051.4384	82659.56	11.53
2019-20	Spring	Business	P002	Management Program 2	887286	556638.1814	330647.82	37.27
2019-20	Spring	Business	P003	Finance Program 1	748543	659855.8575	88687.14	11.85
2019-20	Spring	Business	P004	Finance Program 2	651384	541892.7991	109491.2	16.81
2019-20	Spring	Business	P005	Marketing Program 1	543005	527147.4168	15857.58	2.92
2019-20	Spring	Business	P006	Marketing Program 2	763614	493970.3067	269643.69	35.31
2019-20	Spring	Computing	P013	Computer Science Program 1	444263	482301.2901	-38038.29	-8.56
2019-20	Spring	Computing	P014	Computer Science Program 2	958732	708773.2003	249958.8	26.07
2019-20	Spring	Computing	P015	Data Science Program 1	596860	617904.8412	-21044.84	-3.53
2019-20	Spring	Computing	P016	Data Science Program 2	452011	465525.5931	-13514.59	-2.99
2019-20	Spring	Computing	P017	Cybersecurity Program 1	459002	450147.8708	8854.13	1.93
2019-20	Spring	Computing	P018	Cybersecurity Program 2	568436	542414.2045	26021.8	4.58
2019-20	Spring	Engineering	P007	Civil Program 1	731755	615861.2776	115893.72	15.84
2019-20	Spring	Engineering	P008	Civil Program 2	1044545	629249.5662	415295.43	39.76
2019-20	Spring	Engineering	P009	Mechanical Program 1	1073569	717612.2713	355956.73	33.16
2019-20	Spring	Engineering	P010	Mechanical Program 2	640478	407003.9748	233474.03	36.45
2019-20	Spring	Engineering	P011	Electrical Program 1	590828	485994.8778	104833.12	17.74
2019-20	Spring	Engineering	P012	Electrical Program 2	613903	539548.0323	74354.97	12.11
2019-20	Spring	Health Sciences	P019	Nursing Program 1	786869	436074.8935	350794.11	44.58
2019-20	Spring	Health Sciences	P020	Nursing Program 2	684783	564857.2451	119925.75	17.51
2019-20	Spring	Health Sciences	P021	Public Health Program 1	768521	655387.413	113133.59	14.72
2019-20	Spring	Health Sciences	P022	Public Health Program 2	1021799	846648.3312	175150.67	17.14
2019-20	Spring	Health Sciences	P023	Pharmacy Program 1	1362217	759943.3816	602273.62	44.21
2019-20	Spring	Health Sciences	P024	Pharmacy Program 2	617230	555931.7356	61298.26	9.93
2019-20	Spring	Humanities	P025	Psychology Program 1	534546	528603.9624	5942.04	1.11
2019-20	Spring	Humanities	P026	Psychology Program 2	1117158	710706.7629	406451.24	36.38
2019-20	Spring	Humanities	P027	Education Program 1	777575	519751.743	257823.26	33.16
2019-20	Spring	Humanities	P028	Education Program 2	644973	418583.5205	226389.48	35.1
2019-20	Spring	Humanities	P029	Media Program 1	563259	514693.3318	48565.67	8.62
2019-20	Spring	Humanities	P030	Media Program 2	775559	672768.6794	102790.32	13.25
2020-21	Fall	Business	P001	Management Program 1	767825	483587.3882	284237.61	37.02
2020-21	Fall	Business	P002	Management Program 2	637510	421307.1943	216202.81	33.91
2020-21	Fall	Business	P003	Finance Program 1	763559	506484.5184	257074.48	33.67
2020-21	Fall	Business	P004	Finance Program 2	882216	392914.7529	489301.25	55.46
2020-21	Fall	Business	P005	Marketing Program 1	652562	397494.179	255067.82	39.09
2020-21	Fall	Business	P006	Marketing Program 2	602730	367269.9672	235460.03	39.07
2020-21	Fall	Computing	P013	Computer Science Program 1	528713	414969.353	113743.65	21.51
2020-21	Fall	Computing	P014	Computer Science Program 2	718992	564850.467	154141.53	21.44
2020-21	Fall	Computing	P015	Data Science Program 1	614426	485435.8469	128990.15	20.99
2020-21	Fall	Computing	P016	Data Science Program 2	500764	379176.8481	121587.15	24.28
2020-21	Fall	Computing	P017	Cybersecurity Program 1	499899	375821.3008	124077.7	24.82
2020-21	Fall	Computing	P018	Cybersecurity Program 2	574432	438458.1843	135973.82	23.67
2020-21	Fall	Engineering	P007	Civil Program 1	756192	431081.6226	325110.38	42.99
2020-21	Fall	Engineering	P008	Civil Program 2	795996	450890.6249	345105.38	43.36
2020-21	Fall	Engineering	P009	Mechanical Program 1	1269217	524466.9193	744750.08	58.68
2020-21	Fall	Engineering	P010	Mechanical Program 2	733459	281099.1762	452359.82	61.67
2020-21	Fall	Engineering	P011	Electrical Program 1	618313	345242.6124	273070.39	44.16
2020-21	Fall	Engineering	P012	Electrical Program 2	663142	376371.0446	286770.96	43.24
2020-21	Fall	Health Sciences	P019	Nursing Program 1	539294	330325.8217	208968.18	38.75
2020-21	Fall	Health Sciences	P020	Nursing Program 2	989491	413856.4893	575634.51	58.17
2020-21	Fall	Health Sciences	P021	Public Health Program 1	898581	477453.7021	421127.3	46.87
2020-21	Fall	Health Sciences	P022	Public Health Program 2	1173481	620784.7339	552696.27	47.1
2020-21	Fall	Health Sciences	P023	Pharmacy Program 1	990078	558136.7332	431941.27	43.63
2020-21	Fall	Health Sciences	P024	Pharmacy Program 2	747615	431891.5198	315723.48	42.23
2020-21	Fall	Humanities	P025	Psychology Program 1	555511	386290.7914	169220.21	30.46
2020-21	Fall	Humanities	P026	Psychology Program 2	726445	506888.8921	219556.11	30.22
2020-21	Fall	Humanities	P027	Education Program 1	566803	392886	173917	30.68
2020-21	Fall	Humanities	P028	Education Program 2	487785	304321.7698	183463.23	37.61
2020-21	Fall	Humanities	P029	Media Program 1	550821	389117.3094	161703.69	29.36
2020-21	Fall	Humanities	P030	Media Program 2	1061332	508773.2374	552558.76	52.06
2020-21	Spring	Business	P001	Management Program 1	1102582	478078.7432	624503.26	56.64
2020-21	Spring	Business	P002	Management Program 2	673398	407852.4872	265545.51	39.43
2020-21	Spring	Business	P003	Finance Program 1	708142	487982.446	220159.55	31.09
2020-21	Spring	Business	P004	Finance Program 2	709306	415055.1801	294250.82	41.48
2020-21	Spring	Business	P005	Marketing Program 1	978417	388045.0816	590371.92	60.34
2020-21	Spring	Business	P006	Marketing Program 2	912193	382643.0619	529549.94	58.05
2020-21	Spring	Computing	P013	Computer Science Program 1	503302	368195.7284	135106.27	26.84
2020-21	Spring	Computing	P014	Computer Science Program 2	805646	550755.1704	254890.83	31.64
2020-21	Spring	Computing	P015	Data Science Program 1	669557	469731.5978	199825.4	29.84
2020-21	Spring	Computing	P016	Data Science Program 2	495873	339478.5129	156394.49	31.54
2020-21	Spring	Computing	P017	Cybersecurity Program 1	379176	319991.8308	59184.17	15.61
2020-21	Spring	Computing	P018	Cybersecurity Program 2	569752	425630.1596	144121.84	25.3
2020-21	Spring	Engineering	P007	Civil Program 1	713185	447881.078	265303.92	37.2
2020-21	Spring	Engineering	P008	Civil Program 2	813503	450758.2583	362744.74	44.59
2020-21	Spring	Engineering	P009	Mechanical Program 1	923718	515015.2867	408702.71	44.25
2020-21	Spring	Engineering	P010	Mechanical Program 2	475777	303062.9992	172714	36.3
2020-21	Spring	Engineering	P011	Electrical Program 1	589279	360606.6067	228672.39	38.81
2020-21	Spring	Engineering	P012	Electrical Program 2	672457	395132.7711	277324.23	41.24
2020-21	Spring	Health Sciences	P019	Nursing Program 1	604656	320991.4692	283664.53	46.91
2020-21	Spring	Health Sciences	P020	Nursing Program 2	703288	419234.3128	284053.69	40.39
2020-21	Spring	Health Sciences	P021	Public Health Program 1	848611	500941.2322	347669.77	40.97
2020-21	Spring	Health Sciences	P022	Public Health Program 2	1057484	635174.0284	422309.97	39.94
2020-21	Spring	Health Sciences	P023	Pharmacy Program 1	919367	562221.4218	357145.58	38.85
2020-21	Spring	Health Sciences	P024	Pharmacy Program 2	777100	434797.5355	342302.46	44.05
2020-21	Spring	Humanities	P025	Psychology Program 1	813810	387681.5227	426128.48	52.36
2020-21	Spring	Humanities	P026	Psychology Program 2	869707	509964.246	359742.75	41.36
2020-21	Spring	Humanities	P027	Education Program 1	578219	384964.1288	193254.87	33.42
2020-21	Spring	Humanities	P028	Education Program 2	501451	317935.0805	183515.92	36.6
2020-21	Spring	Humanities	P029	Media Program 1	597891	369565.5637	228325.44	38.19
2020-21	Spring	Humanities	P030	Media Program 2	830028	504529.4583	325498.54	39.22
2021-22	Fall	Business	P001	Management Program 1	774775	678281.5585	96493.44	12.45
2021-22	Fall	Business	P002	Management Program 2	1003401	591884.4779	411516.52	41.01
2021-22	Fall	Business	P003	Finance Program 1	805539	729861.9052	75677.09	9.39
2021-22	Fall	Business	P004	Finance Program 2	992452	560936.2699	431515.73	43.48
2021-22	Fall	Business	P005	Marketing Program 1	636384	563515.2872	72868.71	11.45
2021-22	Fall	Business	P006	Marketing Program 2	581458	520961.5012	60496.5	10.4
2021-22	Fall	Computing	P013	Computer Science Program 1	571772	545028.2419	26743.76	4.68
2021-22	Fall	Computing	P014	Computer Science Program 2	753221	741643.2045	11577.8	1.54
2021-22	Fall	Computing	P015	Data Science Program 1	685016	653455.611	31560.39	4.61
2021-22	Fall	Computing	P016	Data Science Program 2	488234	478526.1222	9707.88	1.99
2021-22	Fall	Computing	P017	Cybersecurity Program 1	495013	461177.7431	33835.26	6.84
2021-22	Fall	Computing	P018	Cybersecurity Program 2	882463	598519.0773	283943.92	32.18
2021-22	Fall	Engineering	P007	Civil Program 1	738263	547504.9306	190758.07	25.84
2021-22	Fall	Engineering	P008	Civil Program 2	1049550	573112.0655	476437.93	45.39
2021-22	Fall	Engineering	P009	Mechanical Program 1	839906	659688.569	180217.43	21.46
2021-22	Fall	Engineering	P010	Mechanical Program 2	715041	397520.2837	317520.72	44.41
2021-22	Fall	Engineering	P011	Electrical Program 1	645884	467025.364	178858.64	27.69
2021-22	Fall	Engineering	P012	Electrical Program 2	695383	484096.7872	211286.21	30.38
2021-22	Fall	Health Sciences	P019	Nursing Program 1	610709	481930.5755	128778.42	21.09
2021-22	Fall	Health Sciences	P020	Nursing Program 2	781468	601724.7472	179743.25	23
2021-22	Fall	Health Sciences	P021	Public Health Program 1	852259	684341.4173	167917.58	19.7
2021-22	Fall	Health Sciences	P022	Public Health Program 2	1039066	859213.369	179852.63	17.31
2021-22	Fall	Health Sciences	P023	Pharmacy Program 1	1013205	800004.7554	213200.24	21.04
2021-22	Fall	Health Sciences	P024	Pharmacy Program 2	1032941	592086.1357	440854.86	42.68
2021-22	Fall	Humanities	P025	Psychology Program 1	614154	487797.1787	126356.82	20.57
2021-22	Fall	Humanities	P026	Psychology Program 2	792108	663117.9251	128990.07	16.28
2021-22	Fall	Humanities	P027	Education Program 1	600844	515228.3159	85615.68	14.25
2021-22	Fall	Humanities	P028	Education Program 2	514326	422200.9811	92125.02	17.91
2021-22	Fall	Humanities	P029	Media Program 1	594085	485411.8624	108673.14	18.29
2021-22	Fall	Humanities	P030	Media Program 2	794371	642842.7367	151528.26	19.08
2021-22	Spring	Business	P001	Management Program 1	1360791	628297.0919	732493.91	53.83
2021-22	Spring	Business	P002	Management Program 2	1151255	557282.6696	593972.33	51.59
2021-22	Spring	Business	P003	Finance Program 1	1213897	648758.8746	565138.13	46.56
2021-22	Spring	Business	P004	Finance Program 2	796546	557282.6696	239263.33	30.04
2021-22	Spring	Business	P005	Marketing Program 1	1009084	521173.6413	487910.36	48.35
2021-22	Spring	Business	P006	Marketing Program 2	686223	493490.053	192732.95	28.09
2021-22	Spring	Computing	P013	Computer Science Program 1	635827	474799.9894	161027.01	25.33
2021-22	Spring	Computing	P014	Computer Science Program 2	831706	683310.0376	148395.96	17.84
2021-22	Spring	Computing	P015	Data Science Program 1	693118	580311.0981	112806.9	16.28
2021-22	Spring	Computing	P016	Data Science Program 2	545088	414507.9272	130580.07	23.96
2021-22	Spring	Computing	P017	Cybersecurity Program 1	512801	400690.9963	112110	21.86
2021-22	Spring	Computing	P018	Cybersecurity Program 2	635994	518762.9513	117231.05	18.43
2021-22	Spring	Engineering	P007	Civil Program 1	800923	584529.9687	216393.03	27.02
2021-22	Spring	Engineering	P008	Civil Program 2	1147958	587122.1194	560835.88	48.86
2021-22	Spring	Engineering	P009	Mechanical Program 1	927132	701176.7474	225955.25	24.37
2021-22	Spring	Engineering	P010	Mechanical Program 2	819984	426408.7798	393575.22	48
2021-22	Spring	Engineering	P011	Electrical Program 1	707061	513245.8262	193815.17	27.41
2021-22	Spring	Engineering	P012	Electrical Program 2	1071588	543055.5585	528532.44	49.32
2021-22	Spring	Health Sciences	P019	Nursing Program 1	840259	396266.5353	443992.46	52.84
2021-22	Spring	Health Sciences	P020	Nursing Program 2	1042626	514648.0474	527977.95	50.64
2021-22	Spring	Health Sciences	P021	Public Health Program 1	858653	636767.9231	221885.08	25.84
2021-22	Spring	Health Sciences	P022	Public Health Program 2	1681089	780071.8588	901017.14	53.6
2021-22	Spring	Health Sciences	P023	Pharmacy Program 1	1584832	720258.0421	864573.96	54.55
2021-22	Spring	Health Sciences	P024	Pharmacy Program 2	711828	499694.5933	212133.41	29.8
2021-22	Spring	Humanities	P025	Psychology Program 1	663774	524446.1891	139327.81	20.99
2021-22	Spring	Humanities	P026	Psychology Program 2	808335	660229.1692	148105.83	18.32
2021-22	Spring	Humanities	P027	Education Program 1	608831	541886.2049	66944.8	11
2021-22	Spring	Humanities	P028	Education Program 2	518266	414823.2327	103442.77	19.96
2021-22	Spring	Humanities	P029	Media Program 1	911197	489566.1575	421630.84	46.27
2021-22	Spring	Humanities	P030	Media Program 2	1162393	682652.0466	479740.95	41.27
2022-23	Fall	Business	P001	Management Program 1	1223866	672074.1341	551791.87	45.09
2022-23	Fall	Business	P002	Management Program 2	1058308	570820.0272	487487.97	46.06
2022-23	Fall	Business	P003	Finance Program 1	966325	716372.8058	249952.19	25.87
2022-23	Fall	Business	P004	Finance Program 2	661060	549303.5295	111756.47	16.91
2022-23	Fall	Business	P005	Marketing Program 1	1032496	544240.8242	488255.18	47.29
2022-23	Fall	Business	P006	Marketing Program 2	918146	525255.6792	392890.32	42.79
2022-23	Fall	Computing	P013	Computer Science Program 1	604335	528991.3949	75343.61	12.47
2022-23	Fall	Computing	P014	Computer Science Program 2	1149850	712574.5267	437275.47	38.03
2022-23	Fall	Computing	P015	Data Science Program 1	613942	618743.1482	-4801.15	-0.78
2022-23	Fall	Computing	P016	Data Science Program 2	513315	475956.2679	37358.73	7.28
2022-23	Fall	Computing	P017	Cybersecurity Program 1	503080	441959.3916	61120.61	12.15
2022-23	Fall	Computing	P018	Cybersecurity Program 2	657968	552109.2707	105858.73	16.09
2022-23	Fall	Engineering	P007	Civil Program 1	848382	574355.5716	274026.43	32.3
2022-23	Fall	Engineering	P008	Civil Program 2	1101000	597177.6473	503822.35	45.76
2022-23	Fall	Engineering	P009	Mechanical Program 1	1332998	658036.5158	674961.48	50.63
2022-23	Fall	Engineering	P010	Mechanical Program 2	570342	414601.0417	155740.96	27.31
2022-23	Fall	Engineering	P011	Electrical Program 1	981027	493210.4136	487816.59	49.73
2022-23	Fall	Engineering	P012	Electrical Program 2	1017508	512228.81	505279.19	49.66
2022-23	Fall	Health Sciences	P019	Nursing Program 1	576930	410886.2748	166043.73	28.78
2022-23	Fall	Health Sciences	P020	Nursing Program 2	753090	526331.6632	226758.34	30.11
2022-23	Fall	Health Sciences	P021	Public Health Program 1	783047	569778.8524	213268.15	27.24
2022-23	Fall	Health Sciences	P022	Public Health Program 2	1022321	751015.6987	271305.3	26.54
2022-23	Fall	Health Sciences	P023	Pharmacy Program 1	1050703	696396.3751	354306.62	33.72
2022-23	Fall	Health Sciences	P024	Pharmacy Program 2	766391	510194.1358	256196.86	33.43
2022-23	Fall	Humanities	P025	Psychology Program 1	561333	471989.5333	89343.47	15.92
2022-23	Fall	Humanities	P026	Psychology Program 2	1160242	677572.6032	482669.4	41.6
2022-23	Fall	Humanities	P027	Education Program 1	922007	514565.9087	407441.09	44.19
2022-23	Fall	Humanities	P028	Education Program 2	521615	408733.2041	112881.8	21.64
2022-23	Fall	Humanities	P029	Media Program 1	604357	501184.7621	103172.24	17.07
2022-23	Fall	Humanities	P030	Media Program 2	810663	662974.9887	147688.01	18.22
2022-23	Spring	Business	P001	Management Program 1	869588	602661.5839	266926.42	30.7
2022-23	Spring	Business	P002	Management Program 2	999908	513293.5164	486614.48	48.67
2022-23	Spring	Business	P003	Finance Program 1	772336	603807.3284	168528.67	21.82
2022-23	Spring	Business	P004	Finance Program 2	760467	541937.1278	218529.87	28.74
2022-23	Spring	Business	P005	Marketing Program 1	764142	504127.5607	260014.44	34.03
2022-23	Spring	Business	P006	Marketing Program 2	751922	489232.8828	262689.12	34.94
2022-23	Spring	Computing	P013	Computer Science Program 1	641060	454382.946	186677.05	29.12
2022-23	Spring	Computing	P014	Computer Science Program 2	849217	675015.0852	174201.91	20.51
2022-23	Spring	Computing	P015	Data Science Program 1	784584	576028.7741	208555.23	26.58
2022-23	Spring	Computing	P016	Data Science Program 2	511894	406678.6997	105215.3	20.55
2022-23	Spring	Computing	P017	Cybersecurity Program 1	476532	381633.9704	94898.03	19.91
2022-23	Spring	Computing	P018	Cybersecurity Program 2	621762	488968.5246	132793.48	21.36
2022-23	Spring	Engineering	P007	Civil Program 1	736585	542585.2382	193999.76	26.34
2022-23	Spring	Engineering	P008	Civil Program 2	737933	511147.896	226785.1	30.73
2022-23	Spring	Engineering	P009	Mechanical Program 1	1361604	613610.3445	747993.66	54.93
2022-23	Spring	Engineering	P010	Mechanical Program 2	539692	399370.6796	140321.32	26
2022-23	Spring	Engineering	P011	Electrical Program 1	651341	462245.3638	189095.64	29.03
2022-23	Spring	Engineering	P012	Electrical Program 2	745601	472724.4779	272876.52	36.6
2022-23	Spring	Health Sciences	P019	Nursing Program 1	533985	376457.993	157527.01	29.5
2022-23	Spring	Health Sciences	P020	Nursing Program 2	637791	490571.8221	147219.18	23.08
2022-23	Spring	Health Sciences	P021	Public Health Program 1	899605	584686.3204	314918.68	35.01
2022-23	Spring	Health Sciences	P022	Public Health Program 2	1069369	736445.9488	332923.05	31.13
2022-23	Spring	Health Sciences	P023	Pharmacy Program 1	1024496	689388.6996	335107.3	32.71
2022-23	Spring	Health Sciences	P024	Pharmacy Program 2	676424	475278.2161	201145.78	29.74
2022-23	Spring	Humanities	P025	Psychology Program 1	586705	477056.2014	109648.8	18.69
2022-23	Spring	Humanities	P026	Psychology Program 2	874001	627283.0341	246717.97	28.23
2022-23	Spring	Humanities	P027	Education Program 1	692686	490817.438	201868.56	29.14
2022-23	Spring	Humanities	P028	Education Program 2	477279	389901.7031	87377.3	18.31
2022-23	Spring	Humanities	P029	Media Program 1	610176	470175.5831	140000.42	22.94
2022-23	Spring	Humanities	P030	Media Program 2	1289297	642191.0404	647105.96	50.19
2023-24	Fall	Business	P001	Management Program 1	861281	628030.7488	233250.25	27.08
2023-24	Fall	Business	P002	Management Program 2	802154	517620.8062	284533.19	35.47
2023-24	Fall	Business	P003	Finance Program 1	978763	679080.5073	299682.49	30.62
2023-24	Fall	Business	P004	Finance Program 2	1018199	529492.8431	488706.16	48
2023-24	Fall	Business	P005	Marketing Program 1	749389	506935.9731	242453.03	32.35
2023-24	Fall	Business	P006	Marketing Program 2	704112	490315.1215	213796.88	30.36
2023-24	Fall	Computing	P013	Computer Science Program 1	880582	518456.2231	362125.78	41.12
2023-24	Fall	Computing	P014	Computer Science Program 2	855840	697415.7316	158424.27	18.51
2023-24	Fall	Computing	P015	Data Science Program 1	689118	618463.0073	70654.99	10.25
2023-24	Fall	Computing	P016	Data Science Program 2	523721	447398.7712	76322.23	14.57
2023-24	Fall	Computing	P017	Cybersecurity Program 1	559678	419765.3177	139912.68	25
2023-24	Fall	Computing	P018	Cybersecurity Program 2	674735	553984.9491	120750.05	17.9
2023-24	Fall	Engineering	P007	Civil Program 1	796673	510583.5801	286089.42	35.91
2023-24	Fall	Engineering	P008	Civil Program 2	1085313	514049.0795	571263.92	52.64
2023-24	Fall	Engineering	P009	Mechanical Program 1	935220	601841.7313	333378.27	35.65
2023-24	Fall	Engineering	P010	Mechanical Program 2	560716	383515.2683	177200.73	31.6
2023-24	Fall	Engineering	P011	Electrical Program 1	972922	472463.0866	500458.91	51.44
2023-24	Fall	Engineering	P012	Electrical Program 2	697260	466687.2542	230572.75	33.07
2023-24	Fall	Health Sciences	P019	Nursing Program 1	597667	385303.8862	212363.11	35.53
2023-24	Fall	Health Sciences	P020	Nursing Program 2	815294	505785.9064	309508.09	37.96
2023-24	Fall	Health Sciences	P021	Public Health Program 1	889068	569009.1447	320058.86	36
2023-24	Fall	Health Sciences	P022	Public Health Program 2	1019445	722892.121	296552.88	29.09
2023-24	Fall	Health Sciences	P023	Pharmacy Program 1	1001220	642968.4046	358251.6	35.78
2023-24	Fall	Health Sciences	P024	Pharmacy Program 2	1128843	487892.5371	640950.46	56.78
2023-24	Fall	Humanities	P025	Psychology Program 1	665038	459766.7345	205271.27	30.87
2023-24	Fall	Humanities	P026	Psychology Program 2	865024	647853.1259	217170.87	25.11
2023-24	Fall	Humanities	P027	Education Program 1	709536	510851.9272	198684.07	28
2023-24	Fall	Humanities	P028	Education Program 2	482582	394749.2165	87832.78	18.2
2023-24	Fall	Humanities	P029	Media Program 1	668124	470215.9785	197908.02	29.62
2023-24	Fall	Humanities	P030	Media Program 2	846133	643209.0175	202923.98	23.98
2023-24	Spring	Business	P001	Management Program 1	830731	553031.0083	277699.99	33.43
2023-24	Spring	Business	P002	Management Program 2	762491	475212.3861	287278.61	37.68
2023-24	Spring	Business	P003	Finance Program 1	913818	570669.896	343148.1	37.55
2023-24	Spring	Business	P004	Finance Program 2	844135	511527.7432	332607.26	39.4
2023-24	Spring	Business	P005	Marketing Program 1	716617	438897.0291	277719.97	38.75
2023-24	Spring	Business	P006	Marketing Program 2	749531	444084.9373	305446.06	40.75
2023-24	Spring	Computing	P013	Computer Science Program 1	641620	447663.4655	193956.53	30.23
2023-24	Spring	Computing	P014	Computer Science Program 2	977112	652795.332	324316.67	33.19
2023-24	Spring	Computing	P015	Data Science Program 1	766765	563262.6389	203502.36	26.54
2023-24	Spring	Computing	P016	Data Science Program 2	769609	370597.3499	399011.65	51.85
2023-24	Spring	Computing	P017	Cybersecurity Program 1	518339	363797.3986	154541.6	29.81
2023-24	Spring	Computing	P018	Cybersecurity Program 2	839264	445396.8151	393867.18	46.93
2023-24	Spring	Engineering	P007	Civil Program 1	1072025	511683.4152	560341.58	52.27
2023-24	Spring	Engineering	P008	Civil Program 2	769107	495212.919	273894.08	35.61
2023-24	Spring	Engineering	P009	Mechanical Program 1	1012944	613800.4916	399143.51	39.4
2023-24	Spring	Engineering	P010	Mechanical Program 2	642217	385409.611	256807.39	39.99
2023-24	Spring	Engineering	P011	Electrical Program 1	754103	446899.4635	307203.54	40.74
2023-24	Spring	Engineering	P012	Electrical Program 2	695634	434821.0996	260812.9	37.49
2023-24	Spring	Health Sciences	P019	Nursing Program 1	560395	348428.5269	211966.47	37.82
2023-24	Spring	Health Sciences	P020	Nursing Program 2	731913	447677.8648	284235.14	38.83
2023-24	Spring	Health Sciences	P021	Public Health Program 1	910377	518419.4142	391957.59	43.05
2023-24	Spring	Health Sciences	P022	Public Health Program 2	1223158	692633.6776	530524.32	43.37
2023-24	Spring	Health Sciences	P023	Pharmacy Program 1	1046956	613445.3761	433510.62	41.41
2023-24	Spring	Health Sciences	P024	Pharmacy Program 2	710702	425505.1404	285196.86	40.13
2023-24	Spring	Humanities	P025	Psychology Program 1	631215	453407.5613	177807.44	28.17
2023-24	Spring	Humanities	P026	Psychology Program 2	823338	561013.5033	262324.5	31.86
2023-24	Spring	Humanities	P027	Education Program 1	679998	471167.7653	208830.23	30.71
2023-24	Spring	Humanities	P028	Education Program 2	569511	359382.9518	210128.05	36.9
2023-24	Spring	Humanities	P029	Media Program 1	968974	417887.1533	551086.85	56.87
2023-24	Spring	Humanities	P030	Media Program 2	1366800	599668.065	767131.94	56.13`;

const programTermTsv = PROGRAM_TERM_TSV;

const PROGRAM_YEAR_TSV = `Academic_Year	College	Program_ID	Program_Name	total_revenue	total_cost	ROI03_Program_Margin_AED	ROI03_Program_Margin_Pct
2019-20	Business	P001	Management Program 1	1364222	1252038.378	112183.62	8.22
2019-20	Business	P002	Management Program 2	1524774	1112214.559	412559.44	27.06
2019-20	Business	P003	Finance Program 1	1450633	1299870.054	150762.95	10.39
2019-20	Business	P004	Finance Program 2	1200126	1063204.554	136921.45	11.41
2019-20	Business	P005	Marketing Program 1	1313183	1044787.962	268395.04	20.44
2019-20	Business	P006	Marketing Program 2	1303930	976122.4931	327807.51	25.14
2019-20	Computing	P013	Computer Science Program 1	1083831	991827.84	92003.16	8.49
2019-20	Computing	P014	Computer Science Program 2	1632483	1410657.036	221825.96	13.59
2019-20	Computing	P015	Data Science Program 1	1127127	1224344.222	-97217.22	-8.63
2019-20	Computing	P016	Data Science Program 2	838390	931000.8562	-92610.86	-11.05
2019-20	Computing	P017	Cybersecurity Program 1	877751	914154.7577	-36403.76	-4.15
2019-20	Computing	P018	Cybersecurity Program 2	1088805	1093055.289	-4250.29	-0.39
2019-20	Engineering	P007	Civil Program 1	1404925	1210117.048	194807.95	13.87
2019-20	Engineering	P008	Civil Program 2	1701173	1240710.96	460462.04	27.07
2019-20	Engineering	P009	Mechanical Program 1	1883782	1424366.35	459415.65	24.39
2019-20	Engineering	P010	Mechanical Program 2	1268691	782880.6757	485810.32	38.29
2019-20	Engineering	P011	Electrical Program 1	1163226	953193.7349	210032.27	18.06
2019-20	Engineering	P012	Electrical Program 2	1189560	1054393.232	135166.77	11.36
2019-20	Health Sciences	P019	Nursing Program 1	1512132	921437.477	590694.52	39.06
2019-20	Health Sciences	P020	Nursing Program 2	1322044	1172955.194	149088.81	11.28
2019-20	Health Sciences	P021	Public Health Program 1	1452294	1352747.447	99546.55	6.85
2019-20	Health Sciences	P022	Public Health Program 2	1998619	1760189.975	238429.02	11.93
2019-20	Health Sciences	P023	Pharmacy Program 1	2819798	1573065.181	1246732.82	44.21
2019-20	Health Sciences	P024	Pharmacy Program 2	1266186	1173792.725	92393.27	7.3
2019-20	Humanities	P025	Psychology Program 1	1118665	1005944.424	112720.58	10.08
2019-20	Humanities	P026	Psychology Program 2	1851974	1367203.284	484770.72	26.18
2019-20	Humanities	P027	Education Program 1	1324049	1027769.612	296279.39	22.38
2019-20	Humanities	P028	Education Program 2	1143816	827206.589	316609.41	27.68
2019-20	Humanities	P029	Media Program 1	1358932	994487.9859	364444.01	26.82
2019-20	Humanities	P030	Media Program 2	1489536	1328038.105	161497.9	10.84
2020-21	Business	P001	Management Program 1	1870407	961666.1315	908740.87	48.59
2020-21	Business	P002	Management Program 2	1310908	829159.6815	481748.32	36.75
2020-21	Business	P003	Finance Program 1	1471701	994466.9644	477234.04	32.43
2020-21	Business	P004	Finance Program 2	1591522	807969.933	783552.07	49.23
2020-21	Business	P005	Marketing Program 1	1630979	785539.2606	845439.74	51.84
2020-21	Business	P006	Marketing Program 2	1514923	749913.0291	765009.97	50.5
2020-21	Computing	P013	Computer Science Program 1	1032015	783165.0814	248849.92	24.11
2020-21	Computing	P014	Computer Science Program 2	1524638	1115605.637	409032.36	26.83
2020-21	Computing	P015	Data Science Program 1	1283983	955167.4447	328815.56	25.61
2020-21	Computing	P016	Data Science Program 2	996637	718655.361	277981.64	27.89
2020-21	Computing	P017	Cybersecurity Program 1	879075	695813.1316	183261.87	20.85
2020-21	Computing	P018	Cybersecurity Program 2	1144184	864088.3439	280095.66	24.48
2020-21	Engineering	P007	Civil Program 1	1469377	878962.7005	590414.3	40.18
2020-21	Engineering	P008	Civil Program 2	1609499	901648.8832	707850.12	43.98
2020-21	Engineering	P009	Mechanical Program 1	2192935	1039482.206	1153452.79	52.6
2020-21	Engineering	P010	Mechanical Program 2	1209236	584162.1754	625073.82	51.69
2020-21	Engineering	P011	Electrical Program 1	1207592	705849.219	501742.78	41.55
2020-21	Engineering	P012	Electrical Program 2	1335599	771503.8158	564095.18	42.24
2020-21	Health Sciences	P019	Nursing Program 1	1143950	651317.2909	492632.71	43.06
2020-21	Health Sciences	P020	Nursing Program 2	1692779	833090.8021	859688.2	50.79
2020-21	Health Sciences	P021	Public Health Program 1	1747192	978394.9343	768797.07	44
2020-21	Health Sciences	P022	Public Health Program 2	2230965	1255958.762	975006.24	43.7
2020-21	Health Sciences	P023	Pharmacy Program 1	1909445	1120358.155	789086.84	41.33
2020-21	Health Sciences	P024	Pharmacy Program 2	1524715	866689.0553	658025.94	43.16
2020-21	Humanities	P025	Psychology Program 1	1369321	773972.3141	595348.69	43.48
2020-21	Humanities	P026	Psychology Program 2	1596152	1016853.138	579298.86	36.29
2020-21	Humanities	P027	Education Program 1	1145022	777850.1288	367171.87	32.07
2020-21	Humanities	P028	Education Program 2	989236	622256.8503	366979.15	37.1
2020-21	Humanities	P029	Media Program 1	1148712	758682.873	390029.13	33.95
2020-21	Humanities	P030	Media Program 2	1891360	1013302.696	878057.3	46.42
2021-22	Business	P001	Management Program 1	2135566	1306578.65	828987.35	38.82
2021-22	Business	P002	Management Program 2	2154656	1149167.148	1005488.85	46.67
2021-22	Business	P003	Finance Program 1	2019436	1378620.78	640815.22	31.73
2021-22	Business	P004	Finance Program 2	1788998	1118218.94	670779.06	37.49
2021-22	Business	P005	Marketing Program 1	1645468	1084688.929	560779.07	34.08
2021-22	Business	P006	Marketing Program 2	1267681	1014451.554	253229.45	19.98
2021-22	Computing	P013	Computer Science Program 1	1207599	1019828.231	187770.77	15.55
2021-22	Computing	P014	Computer Science Program 2	1584927	1424953.242	159973.76	10.09
2021-22	Computing	P015	Data Science Program 1	1378134	1233766.709	144367.29	10.48
2021-22	Computing	P016	Data Science Program 2	1033322	893034.0494	140287.95	13.58
2021-22	Computing	P017	Cybersecurity Program 1	1007814	861868.7395	145945.26	14.48
2021-22	Computing	P018	Cybersecurity Program 2	1518457	1117282.029	401174.97	26.42
2021-22	Engineering	P007	Civil Program 1	1539186	1132034.899	407151.1	26.45
2021-22	Engineering	P008	Civil Program 2	2197508	1160234.185	1037273.82	47.2
2021-22	Engineering	P009	Mechanical Program 1	1767038	1360865.316	406172.68	22.99
2021-22	Engineering	P010	Mechanical Program 2	1535025	823929.0635	711095.94	46.32
2021-22	Engineering	P011	Electrical Program 1	1352945	980271.1902	372673.81	27.55
2021-22	Engineering	P012	Electrical Program 2	1766971	1027152.346	739818.65	41.87
2021-22	Health Sciences	P019	Nursing Program 1	1450968	878197.1108	572770.89	39.48
2021-22	Health Sciences	P020	Nursing Program 2	1824094	1116372.795	707721.21	38.8
2021-22	Health Sciences	P021	Public Health Program 1	1710912	1321109.34	389802.66	22.78
2021-22	Health Sciences	P022	Public Health Program 2	2720155	1639285.228	1080869.77	39.74
2021-22	Health Sciences	P023	Pharmacy Program 1	2598037	1520262.798	1077774.2	41.48
2021-22	Health Sciences	P024	Pharmacy Program 2	1744769	1091780.729	652988.27	37.43
2021-22	Humanities	P025	Psychology Program 1	1277928	1012243.368	265684.63	20.79
2021-22	Humanities	P026	Psychology Program 2	1600443	1323347.094	277095.91	17.31
2021-22	Humanities	P027	Education Program 1	1209675	1057114.521	152560.48	12.61
2021-22	Humanities	P028	Education Program 2	1032592	837024.2138	195567.79	18.94
2021-22	Humanities	P029	Media Program 1	1505282	974978.02	530303.98	35.23
2021-22	Humanities	P030	Media Program 2	1956764	1325494.783	631269.22	32.26
2022-23	Business	P001	Management Program 1	2093454	1274735.718	818718.28	39.11
2022-23	Business	P002	Management Program 2	2058216	1084113.544	974102.46	47.33
2022-23	Business	P003	Finance Program 1	1738661	1320180.134	418480.87	24.07
2022-23	Business	P004	Finance Program 2	1421527	1091240.657	330286.34	23.23
2022-23	Business	P005	Marketing Program 1	1796638	1048368.385	748269.62	41.65
2022-23	Business	P006	Marketing Program 2	1670068	1014488.562	655579.44	39.25
2022-23	Computing	P013	Computer Science Program 1	1245395	983374.3409	262020.66	21.04
2022-23	Computing	P014	Computer Science Program 2	1999067	1387589.612	611477.39	30.59
2022-23	Computing	P015	Data Science Program 1	1398526	1194771.922	203754.08	14.57
2022-23	Computing	P016	Data Science Program 2	1025209	882634.9676	142574.03	13.91
2022-23	Computing	P017	Cybersecurity Program 1	979612	823593.362	156018.64	15.93
2022-23	Computing	P018	Cybersecurity Program 2	1279730	1041077.795	238652.2	18.65
2022-23	Engineering	P007	Civil Program 1	1584967	1116940.81	468026.19	29.53
2022-23	Engineering	P008	Civil Program 2	1838933	1108325.543	730607.46	39.73
2022-23	Engineering	P009	Mechanical Program 1	2694602	1271646.86	1422955.14	52.81
2022-23	Engineering	P010	Mechanical Program 2	1110034	813971.7213	296062.28	26.67
2022-23	Engineering	P011	Electrical Program 1	1632368	955455.7774	676912.22	41.47
2022-23	Engineering	P012	Electrical Program 2	1763109	984953.2879	778155.71	44.14
2022-23	Health Sciences	P019	Nursing Program 1	1110915	787344.2678	323570.73	29.13
2022-23	Health Sciences	P020	Nursing Program 2	1390881	1016903.485	373977.51	26.89
2022-23	Health Sciences	P021	Public Health Program 1	1682652	1154465.173	528186.83	31.39
2022-23	Health Sciences	P022	Public Health Program 2	2091690	1487461.647	604228.35	28.89
2022-23	Health Sciences	P023	Pharmacy Program 1	2075199	1385785.075	689413.93	33.22
2022-23	Health Sciences	P024	Pharmacy Program 2	1442815	985472.3519	457342.65	31.7
2022-23	Humanities	P025	Psychology Program 1	1148038	949045.7347	198992.27	17.33
2022-23	Humanities	P026	Psychology Program 2	2034243	1304855.637	729387.36	35.86
2022-23	Humanities	P027	Education Program 1	1614693	1005383.347	609309.65	37.74
2022-23	Humanities	P028	Education Program 2	998894	798634.9071	200259.09	20.05
2022-23	Humanities	P029	Media Program 1	1214533	971360.3452	243172.65	20.02
2022-23	Humanities	P030	Media Program 2	2099960	1305166.029	794793.97	37.85
2023-24	Business	P001	Management Program 1	1692012	1181061.757	510950.24	30.2
2023-24	Business	P002	Management Program 2	1564645	992833.1924	571811.81	36.55
2023-24	Business	P003	Finance Program 1	1892581	1249750.403	642830.6	33.97
2023-24	Business	P004	Finance Program 2	1862334	1041020.586	821313.41	44.1
2023-24	Business	P005	Marketing Program 1	1466006	945833.0022	520173	35.48
2023-24	Business	P006	Marketing Program 2	1453643	934400.0588	519242.94	35.72
2023-24	Computing	P013	Computer Science Program 1	1522202	966119.6886	556082.31	36.53
2023-24	Computing	P014	Computer Science Program 2	1832952	1350211.064	482740.94	26.34
2023-24	Computing	P015	Data Science Program 1	1455883	1181725.646	274157.35	18.83
2023-24	Computing	P016	Data Science Program 2	1293330	817996.1212	475333.88	36.75
2023-24	Computing	P017	Cybersecurity Program 1	1078017	783562.7163	294454.28	27.31
2023-24	Computing	P018	Cybersecurity Program 2	1513999	999381.7641	514617.24	33.99
2023-24	Engineering	P007	Civil Program 1	1868698	1022266.995	846431	45.3
2023-24	Engineering	P008	Civil Program 2	1854420	1009261.999	845158	45.58
2023-24	Engineering	P009	Mechanical Program 1	1948164	1215642.223	732521.78	37.6
2023-24	Engineering	P010	Mechanical Program 2	1202933	768924.8793	434008.12	36.08
2023-24	Engineering	P011	Electrical Program 1	1727025	919362.5501	807662.45	46.77
2023-24	Engineering	P012	Electrical Program 2	1392894	901508.3538	491385.65	35.28
2023-24	Health Sciences	P019	Nursing Program 1	1158062	733732.4131	424329.59	36.64
2023-24	Health Sciences	P020	Nursing Program 2	1547207	953463.7712	593743.23	38.38
2023-24	Health Sciences	P021	Public Health Program 1	1799445	1087428.559	712016.44	39.57
2023-24	Health Sciences	P022	Public Health Program 2	2242603	1415525.799	827077.2	36.88
2023-24	Health Sciences	P023	Pharmacy Program 1	2048176	1256413.781	791762.22	38.66
2023-24	Health Sciences	P024	Pharmacy Program 2	1839545	913397.6775	926147.32	50.35
2023-24	Humanities	P025	Psychology Program 1	1296253	913174.2958	383078.7	29.55
2023-24	Humanities	P026	Psychology Program 2	1688362	1208866.629	479495.37	28.4
2023-24	Humanities	P027	Education Program 1	1389534	982019.6925	407514.31	29.33
2023-24	Humanities	P028	Education Program 2	1052093	754132.1683	297960.83	28.32
2023-24	Humanities	P029	Media Program 1	1637098	888103.1317	748994.87	45.75
2023-24	Humanities	P030	Media Program 2	2212933	1242877.082	970055.92	43.84`;

function parseProgramTerm(tsv) {
  const lines = tsv.trim().split('\n');
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const [academicYear, term, college, programId, programName, totalRevenue, totalCost, marginAed, marginPct] = lines[i].split('\t');
    data.push({
      academicYear,
      term,
      college,
      programId,
      programName,
      totalRevenue: parseFloat(totalRevenue),
      totalCost: parseFloat(totalCost),
      marginAed: parseFloat(marginAed),
      marginPct: parseFloat(marginPct),
    });
  }
  return data;
}

function parseProgramYear(tsv) {
  const lines = tsv.trim().split('\n');
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const [academicYear, college, programId, programName, totalRevenue, totalCost, marginAed, marginPct] = lines[i].split('\t');
    data.push({
      academicYear,
      college,
      programId,
      programName,
      totalRevenue: parseFloat(totalRevenue),
      totalCost: parseFloat(totalCost),
      marginAed: parseFloat(marginAed),
      marginPct: parseFloat(marginPct),
    });
  }
  return data;
}

const programTerm = parseProgramTerm(programTermTsv);
const programYear = parseProgramYear(PROGRAM_YEAR_TSV);

const dataDir = path.join(__dirname, '../src/data/KPIs');
fs.writeFileSync(path.join(dataDir, 'ROI-03-program-term.json'), JSON.stringify(programTerm, null, 2));
fs.writeFileSync(path.join(dataDir, 'ROI-03-program-year.json'), JSON.stringify(programYear, null, 2));
console.log('Wrote ROI-03-program-term.json:', programTerm.length, 'records');
console.log('Wrote ROI-03-program-year.json:', programYear.length, 'records');

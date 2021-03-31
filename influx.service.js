/**##############################################################################################################################################
 * Universidade Estadual Paulista "Júlio de Mesquita Filho"
 * Instituto de Ciência e Tecnologia de Sorocaba - ICTS
 * Trabalho de Gradução do curso de Engenharia de Controle e Automação
 * Aluno: Felipe de Oliveira Domingues
 * Orientador: Prof. Dr. Eduardo Paciencia Godoy
 * 
 * Objetivos gerais: a aplicação consiste em consumir a API e escrever no banco de dados para que uma aplicação web
 * possa consultar os dados em real-time e criar histórico que poderão ser utilizados para BI.
 */
/**##############################################################################################################################################
 * Início da aplicação
 * 
 * 
 * Importação dos módulos request(1) e influx(2).
 * 1- permite fazer requisições via protocolo HTTP
 * 2- módulo que permite executar consultas/escrita no banco de dados
 */
const request = require('request');
const Influx = require('influx');
/**
 * url1 refere-se a rota que contém os dados das variáveis de controle = vControl
 */
const url1 = 'http://192.168.1.201:3005/api/control/data'
/**
 * wdb1 é a função que captura os valores do body response e escreve-os no banco na medição vProcess
 * 
 * MeasurementName,   tag-key1 = tagValue1    tag-key2 = tagValue2    field-key = "fieldValue"
 * 
 * vControl,          variable = inputs          malha = '1'                 SP = setpointInPercentage
 * vControl,          variable = outputs         malha = '1'                 PV = processVariableInPercentage
 * vControl,          variable = outputs         malha = '1'                 MV = manipulatedVariableInPercentage
 * 
 * Observação: será segmentado em várias medições dependendo a malha que esteja trabalhando. Malha 1 é pipe-pressure.
 */
const wdb1 = () => {
  request({ url: url1, json: true}, (error, response) => {
    if(error){
      console.log('Unable to connect to daq service!')
      }
    else{
      influx.writeMeasurement('vControl', [
        {
          tags: { variable: 'inputs', malha: '1' },
          fields: {   SP: Number(response.body.control.inputs.setpointInPercentage) },
        }
      ]),
      influx.writeMeasurement('vControl', [
        {
          tags: { variable: 'outputs', malha: '1' },
          fields: {   PV: Number(response.body.control.inputs.processVariableInPercentage) },
        }
      ]),
      influx.writeMeasurement('vControl', [
        {
          tags: { variable: 'outputs', malha: '1' },
          fields: {   MV: Number(response.body.control.outputs.manipulatedVariableInPercentage) },
        }
      ])
      
    }
  })
}
/**
 * Escreve no banco ciclicamente. Valor estabelecido em 1000ms = 1 s
 */
setInterval(()=> {
  console.log('writing in the database...')
  wdb1();
},1000)
/**
 * url2 refere-se a rota que contém os dados das variáveis de processos = vProcess
 */
const url2 = 'http://192.168.1.201:3005/api/daq/riin'
/**
 * wdb2 é a função que captura os valores do body response e escreve-os no banco na medição vProcess
 * 
 * MeasurementName,   tag-key1 = tagValue1        tag-key2 = tagValue2    field-key = "fieldValue"
 * 
 * vProcess,          variable = reservoir                                   PIT129 = riin[0]
 * vProcess,          variable = pipe-pressure                               PIT118 = riin[1]
 * vProcess,          variable = level                                       LIT125 = riin[2]
 * vProcess,          variable = flow                                        FIT116 = riin[3]
 * 
 * Observação: há uma variável de processo em outra rota (temperatura = ruin). Verificar possibilidade de colocar na mesma rota.
 * Também foi escrito os valores em unidades de engenharia para fins de testes.
 */
const wdb2 = () => {
  request({ url: url2, json: true}, (error, response) => {
    if(error){
      console.log('Unable to connect to daq service!')
      }
    else{
      influx.writeMeasurement('vProcessi', [
        {
          tags: { variable: 'reservoir' },
          fields: {   PIT129: Number(response.body.riin[0]), PIT129E: Number(((response.body.riin[0])/(0.040))) 
          },
        }
      ])
      influx.writeMeasurement('vProcessi', [
        {
          tags: { variable: 'pipe-pressure' },
          fields: {   PIT118: Number(response.body.riin[1]), PIT118E: Number(((response.body.riin[1])/(40))) 
          },
        }
      ])
      influx.writeMeasurement('vProcessi', [
        {
          tags: { variable: 'level' },
          fields: {   LIT125: Number(response.body.riin[2]), LIT125E: Number(((response.body.riin[2])/(100.0))*(400.0))
          },
        }
      ])      
      influx.writeMeasurement('vProcessi', [
        {
          tags: { variable: 'flow' },
          fields: {   FIT116: Number(response.body.riin[3]), 
          },
        }
      ])
    }
  })
}
/**
 * Escreve no banco ciclicamente. Valor estabelecido em 1000ms = 1 s
 */
setInterval(()=> {
  console.log('writing in the database...')
  wdb2();
},1000)
/**
 * url3 refere-se a rota que contém os dados das variáveis de processos = vProcess, porém com tensão como entrada
 */
const url3 = 'http://192.168.1.201:3005/api/daq/ruin'
/**
 * wdb3 é a função que captura os valores do body response e escreve-os no banco na medição vProcess
 * 
 * MeasurementName,   tag-key1 = tagValue1        tag-key2 = tagValue2    field-key = "fieldValue"
 * 
 * vProcess,          variable = temperature                                 PIT129 = ruin[0]
 */
const wdb3 = () => {
  request({ url: url3, json: true}, (error, response) => {
    if(error){
      console.log('Unable to connect to daq service!')
      }
    else{
      influx.writeMeasurement('vProcessu', [
        {
          tags: { variable: 'temperature' },
          fields: {   TIT127: Number(response.body.ruin[0]) },
        }
      ])
      
    }
  })
}
/**
 * Escreve no banco ciclicamente. Valor estabelecido em 1000ms = 1 s
 */
setInterval(()=> {
  console.log('writing in the database...')
  wdb3();
},1000)
/**
 * Setamos o db-10 como sendo o banco de dados padrão e fornecemos algumas informações sobre o esquema que estamos escrevendo.
 * Definição dos formatos de dados que estamos gravando.
 */
const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'data_db',
  schema: [
    {
      measurement: 'vControl',
      fields: {

        SP: Influx.FieldType.INTEGER,
        PV: Influx.FieldType.INTEGER,
        MV: Influx.FieldType.INTEGER,
      },
      measurement: 'vProcessi',
      fields: {
        
        PIT129: Influx.FieldType.INTEGER,
        PIT129E: Influx.FieldType.INTEGER,
        PIT118: Influx.FieldType.INTEGER,
        PIT118E: Influx.FieldType.INTEGER,
        LIT125: Influx.FieldType.INTEGER,
        LIT125E: Influx.FieldType.INTEGER,
        FIT116: Influx.FieldType.INTEGER,
        
      },
      measurement: 'vProcessu',
      fields: {
        
        TIT127: Influx.FieldType.INTEGER,
        
      },

      tags: [
              'variable', 'malha'
            ]
    }
  ]
})
/**
 *Verificando se o banco de dados definido acima existe e inicializando o aplicativo.
 */
influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('data_db')) {
    return influx.createDatabase('data_db');
    }
  })
  .catch(err => {
    console.error(`Error creating Influx database!`);
  })
  /**
   * Fim da aplicação
   */
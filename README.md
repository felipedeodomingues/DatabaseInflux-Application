# DatabaseInflux-Application
Database service for application of IIoT - Graduation work of the Control and Automation Engineering course - Universidade Estadual Paulista "Júlio de Mesquita Filho"



Primeiros-passos:

Instalação da biblioteca influx para o funcionamento do serviço de escrita no banco de dados.

$ npm install influx express

A lógica e recursos utilizados estão no arquivo influx.service dentro do diretório. O código encontra-se devidamente comentado.



Resumo da aplicação:

O serviço denominado influx.service está localizado na raspberry-4 e é a responsavél por consumir dados do microserviço api.service. Os dados consumidos via protocolo HTTP é escrito no banco de dados relacional InfluxDB, o qual está instalado localmente. São três os tipos de medições realizados nesta fase do projeto:

1- Medições das variáveis de processos:

São variáveis oriundas dos sensores. Essas váriaveis estão disponíveis de duas distintas rotas e são 5: pressão do reservatório inox, pressão de linha, nível do tanque de acrílico, vazão de linha e temperatura. As 4 primeiras são valores de input de correntes obtidas pela ação RIIN do daq.service. A temperatura é um  output de tensão obtido pela ação RUIN.



2- Medições das variávéis de controle:

As variáveis de controle são 3:    o input sendo o setpoint e as saídas sendo variavel de processo e a variavel manipulada. Inicialmente os testes estão sendo realizados na malha 1, de pressão de linha. Pretende-se capturar os valores referentes a diferentes malhas.



3- Medições das variáveis manipuladas.

Essas são as saídas de três atuadores: as bombas 1, 2 e a válvula. Atualmente não está sendo possível capturar os valores manipulados pois é necessário a modificação da ação wuout como apenas um response.



Observação: a documentação referente à integração ao Grafana está em documento a parte e não se encontra neste repositório. 
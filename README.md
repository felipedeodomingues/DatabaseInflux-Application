# DatabaseInflux-Application
**Database service for application of IIoT - Graduation work of the Control and Automation Engineering course - Universidade Estadual Paulista "Júlio de Mesquita Filho"**



**Primeiros-passos:**

Instalação da biblioteca influx para o funcionamento do serviço de escrita no banco de dados.

$ npm install influx express

A lógica e recursos utilizados estão no arquivo <u>influx.service</u> dentro do diretório principal. O código main encontra-se devidamente comentado.



**Resumo da aplicação:**

O serviço denominado <u>influx.service</u> é o responsavél por consumir dados do microserviço <u>api.service</u>. Os dados são consumidos via protocolo HTTP através de rotas específicas das ações do microserviço <u>daq.service</u>. Os dados então são escritos, por meio de regras, no banco de dados relacional InfluxDB. Tanto o serviço <u>influx.service</u> quanto o banco InfluxDB estão instalados localmente, na raspberry-4.



A escrita dos dados estão classificadas em 3 medições distintas no mesmo banco de daos, são elas:

**1- Medições das variáveis de processos:**

São variáveis oriundas dos sensores. Essas váriaveis estão disponíveis na response de duas distintas rotas. São os sensores: pressão do reservatório em inox, pressão de linha, nível do tanque de acrílico, vazão de linha e a temperatura. 

As 4 primeiras são valores apartir do input de corrente obtidas pela ação RIIN do <u>daq.service</u>.  O sensor de temperatura não possui input por corrente e então essa variável de processos é a sua saída de tensão obtido pela ação RUIN.



**2- Medições das variávéis de controle:**

As variaveis de controle são 3:    o input sendo o setpoint e as saídas sendo variável de processo e a variável manipulada. Inicialmente os testes estão sendo realizados na malha 1, de pressão de linha. Pretende-se obter as variaveis de de diferentes malhas (à implementar).



**3- Medições das variáveis manipuladas.**

Essas são as saídas dos três atuadores presentes na planta: as bombas 1, 2 e a válvula. Atualmente, não está sendo possível obter essas variáveis pois foi constatado que é necessário modificar a ação wuout como sendo um metódo GET (está como post).



Observação: a parte que faz o monitoramento em si, com as visões e os dash estão documentado a parte.

Obrigado,

Felipe
# SAF-T AO



[![GitHub Todas as versões](https://camo.githubusercontent.com/58f2b72b7ed8d073a865a547ed26727cc19577f830298ae0d98aa19374d3d9ed/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f646f776e6c6f6164732f6173736f66742d706f72747567616c2f5341462d542d414f2f746f74616c)](https://github.com/assoft-portugal/SAF-T-AO/releases) [![Problemas do GitHub](https://camo.githubusercontent.com/6729c3ebd2513c0c5e1b44ae3b95441d9cefaf40281ebd2ffac1b36ef58fbf14/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6973737565732d7261772f6173736f66742d706f72747567616c2f5341462d542d414f)](https://github.com/assoft-portugal/SAF-T-AO/issues) [![Tag do GitHub (SemVer mais recente)](https://camo.githubusercontent.com/9b73505380509895260fd76154c6efdeda710cdef5b355fc097f0b323f4a3387/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f762f7461672f6173736f66742d706f72747567616c2f5341462d542d414f)](https://github.com/assoft-portugal/SAF-T-AO/releases) [![Licença](https://camo.githubusercontent.com/6581c31c16c1b13ddc2efb92e2ad69a93ddc4a92fd871ff15d401c4c6c9155a4/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542d626c75652e737667)](https://github.com/assoft-portugal/SAF-T-AO/blob/master/LICENSE) [![Discussão](https://camo.githubusercontent.com/6ead706f7d61bfe7166bdd2c75a0ccdabb41ee1b02215b5e5553354469689135/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f646973637573696f6e2d74656c656772616d2d626c7565)](https://t.me/saftao)

XSD oficial do Governo de Angola para uso em SAF-T AO. O objetivo deste esquema é padronizar o formato dos dados fiscais, facilitando a auditoria e o cumprimento das normas fiscais angolanas.

> O Arquivo de Auditoria Padrão para Fins Fiscais (SAF-T) é um arquivo XML padronizado usado para exportar as informações contábeis de uma empresa para as autoridades fiscais. O arquivo contém dados contábeis que podem ser exportados de um sistema contábil original para um período de tempo específico.
>
> O arquivo SAF-T é baseado em uma diretiva da Organização para Cooperação e Desenvolvimento Econômico (OCDE).
>
> [Oracle, JD Edwards EnterpriseOne Applications Guia de Implementação de Localizações do Arquivo de Auditoria Padrão da OCDE para Fins Fiscais (SAF-T).](https://docs.oracle.com/cd/E16582_01/doc.91/e97460/ch_eu_saft_xml.htm#EOAST109)

## Implementação do IVA em Angola



A [legislação](https://github.com/assoft-portugal/SAF-T-AO/blob/master/Resources/Legislation/README.md) do IVA entrará em vigor a partir de outubro de 2019. O prazo se aplica a soluções de faturamento de software, arquivo SAF-T e regras de faturamento:

- As soluções de software devem seguir os requisitos do novo sistema jurídico para processar documentos de vendas, faturas e outros documentos financeiros de acordo com a estrutura legal. Esta regra aplica-se a todos os sujeitos do regime do IVA.
- Os criadores de software devem se inscrever em um programa de certificação de software do governo, que é obrigatório.
- A partir de 1º de janeiro de 2020, será obrigatório produzir um arquivo SAF-T mensal e enviá-lo às autoridades fiscais do governo.
- A partir de 1 de janeiro de 2020, todos os contribuintes com um volume de negócios anual superior a AKZ 50.000.000 serão obrigados a produzir os ficheiros SAF-T acima referidos e a utilizar software certificado.

## Estrutura do esquema



O esquema XML é organizado nos seguintes elementos principais:

- **AuditFile**: o elemento raiz que contém todos os dados do arquivo de auditoria.
- **Cabeçalho**: metadados sobre o arquivo de auditoria.
- **MasterFiles**: arquivos de dados mestre, como contas contábeis, clientes, fornecedores, produtos e tabelas de impostos.
- **GeneralLedgerEntries**: entradas da contabilidade.
- **SourceDocuments**: documentos de origem, como faturas de vendas, faturas de compra e movimentação de mercadorias.

## Validação XML



### Unix



- [xmllint](http://xmlsoft.org/xmllint.html)

### Windows



- [XmlPad](https://xmlpad-mobile.com/) com uma interface gráfica do usuário
- [Test-XML](https://www.powershellgallery.com/packages/Test-XML/1.0) com [o PowerShell](https://docs.microsoft.com/en-us/powershell/)

### Instalando o xmllint



```
sudo apt install libxml2-utils
```



### Validação XML em relação ao XSD



```
xmllint -schema schema.xsd file.xml --noout
```



## Contribuintes



Este projeto existe graças a todas as pessoas que contribuem. [[Contribuir\]](https://github.com/assoft-portugal/SAF-T-AO/blob/master/CONTRIBUTING.md).

[![img](https://camo.githubusercontent.com/19c3cfc25adc38f334bbb22ba05f13ed0891f855ae02d77514239a5eeb99b9f8/68747470733a2f2f636f6e747269622e726f636b732f696d6167653f7265706f3d6173736f66742d706f72747567616c2f5341462d542d414f)](https://github.com/assoft-portugal/SAF-T-AO/graphs/contributors)
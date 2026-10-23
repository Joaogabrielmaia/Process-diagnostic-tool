# ADR-005 · Link do cliente: token com expiração, só escrita

**Status:** aceita.

## Contexto
O Marcos quer um formulário curto para o cliente adiantar o básico ([reunião 1](../01-discovery/03-reuniao-socio.md)). O Ricardo exige que dado de paciente não circule ([reunião 3](../01-discovery/05-reuniao-dono-clinica.md)). O cliente **não** tem conta.

## Alternativas
1. **Conta para o cliente** (e-mail e senha): seguro, mas atrito alto para quem vai responder uma vez.
2. **Link público fixo** do diagnóstico: simples, mas qualquer um com o link lê e escreve.
3. **Link com token aleatório, validade e permissão só de escrita**: o cliente acrescenta, nunca lê.

## Escolha
A opção 3. O token é gerado com 24 bytes aleatórios (base64url), vale **14 dias** e só permite **acrescentar** processos à versão mais recente, marcados `needsReview` para o consultor revisar. O formulário **não exibe nenhum dado existente**, pede apenas 6 campos e avisa para não informar dados de pacientes.

## Motivo
- Zero atrito para o cliente e **zero exposição de dados**: a pior coisa que um link vazado permite é alguém acrescentar processos "para revisar" (que o consultor vê e pode excluir).
- Os campos que o cliente preenche sozinho são os que ele realmente sabe (nome, frequência, tempo, ferramentas).

## Trade-off
Quem tem o link pode enviar lixo durante 14 dias. Aceitei porque o dano é baixo e visível. Não implementei limite de envios por link nem CAPTCHA; está no [roadmap](../06-pos-lancamento/roadmap.md). Como o Mapa roda localmente, o link só funciona na máquina (ou rede local) do consultor.

## Quando eu mudaria de ideia
Se o link passasse a expor qualquer leitura (por exemplo, ver o relatório), eu exigiria autenticação do cliente. Também limitaria envios por link caso houvesse abuso.

## Testes
Integração: token válido, inexistente e expirado (nada é gravado com token expirado). E2E: o cliente responde e o consultor vê o item marcado "revisar"; o formulário não mostra "Ranking" nem nada do diagnóstico.

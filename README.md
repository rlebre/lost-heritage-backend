<img src="https://github.com/rlebre/lost-heritage/blob/master/logo.png" alt="logo" width="100"/>

# Lost Heritage

[![Actions Status](https://github.com/Digital-Initiative-Aveiro/lost-heritage-backend/workflows/Tests/badge.svg)](https://github.com/Digital-Initiative-Aveiro/lost-heritage-backend/actions)

The first part of this documentation is divided into English and Portuguese languages as it is a project developed for a cause in Portugal. However, it may be adapted to any other country easily. In fact, the maintainers encourage that and commit to provide help needed to deploy the solution.

## EN version

### About

Lost Heritage is a non-profit project. The main goal of the project is to map and gather information about abandoned public buildings in Portugal.

Once the information about the buildings is centralized, it can be used to develop plans and public discussion about the recovering of such legacy.

In fact, there are many good examples in the field. Our platform maps also heritage which was once forgotten but nowadays has gained a new purpose.

Feel free to contribute! Lost Heritage platform is open to any citizen of the world, because there are no boundaries and we all are seeking for a common goal. The maintainers of the project thank for your contribution. However, please bear in mind that for quality purposes, the contributions will be curated and may be edited before approval by our curators.

Check out the news: [in Publico by Maria José Santana](https://www.publico.pt/2020/09/20/local/noticia/portugueses-desafiados-descobrir-patrimonio-esquecido-1932046)

Follow us on social media: [Facebook](https://www.facebook.com/patrimonioesquecido)

Contribute for this open-source platform: [GitHub](https://github.com/rlebre/lost-heritage)

### Instructions

#### Want to submit?

Go to [Create Post](https://patrimonioesquecido.ruilebre.com/new-post) page

- Fill in at least the required fields
- If you have, upload some images of the building
- Accept our terms and conditions, if you agree with them
- Submit and... it's done!

Now, our curators will look into your post. If the building was already posted, don't worry, we will look into it and update with the awesome informations you sent.

If everything fits our T&C, your post will be available for everyone soon! Bear in mind that posts containing racism, nudity or some sort of discrimination will not be tolerated and the submitter will be banned.

#### Still searching for help?

Need more help with the platform? Found a bug? Want to contribute with you programming skills? Have a suggestion? E-mail us: [patrimonioesquecido2020@gmail.com](mailto:patrimonioesquecido2020@gmail.com)

## PT version

### Acerca

O Património Esquecido é um projeto sem fins lucrativos. Os principais objetivos são mapear e recolher informação acerca de património público abandonado em Portugal

Assim que as informações sobre os edifícios estejam centralizadas, estas podem ser usadas para desenvolver planos e discussão pública sobre a recuperação de tal património.

De facto, são vários os bons exemplos neste campo. A nossa plataforma mapeia também património que fora outrora esquecido mas que hoje em dia ganhou um novo propósito.

Sinta-se livre para contribuir! A plataforma Patriimónio Esquecido está aberta a qualquer cidadão do mundo, porque afinal de contas não há fronteiras e procuramos todos um objetivo comum. Os responsáveis do projeto agradencem a sua contribuição. Todavida, tenha em mente que por razões de controlo de qualidade, as contribuições serão curadas e poderão ser editadas antes da aprovação dos nossos curadores.

Veja-nos nas notícias: [in Publico por Maria José Santana](https://www.publico.pt/2020/09/20/local/noticia/portugueses-desafiados-descobrir-patrimonio-esquecido-1932046)

Siga-nos nas redes sociais: [Facebook](https://www.facebook.com/patrimonioesquecido)

Contribua para esta plataforma open-source: [GitHub](https://github.com/rlebre/lost-heritage)

### Instruções

#### Deseja submeter?

- Navegue até à [página de criar uma publicação](https://patrimonioesquecido.ruilebre.com/new-post)
- Preencha os campos obrigatórios, pelo menos
- Se tiver, envie algumas imagens do edifício
- Aceite os nossos termos e condições, se concordar com eles
- Submita e... já está!

Agora, os nossos curadores vão rever a sua submissão. Se o edifício já tiver sido submetido, não se preocupe, nós vamos avaliar e adicionar as novas e importantes informações que submeteu.

Se tudo estiver de acordo com os nossos T&C, a sua submissão irá estar disponível o mais rapidamente possível! Tenha em atenção que submissões contendo racismo, pornografia ou algum tipo de discriminação não serão tolerados e o contribuidor será banido.

Ainda a procurar ajuda?
Necessita de mais ajuda com a plataforma? Reportar um erro? Quer contribuir com as suas habilidades de programador informático? Tem alguma sugestão? Envie-nos um e-mail: [patrimonioesquecido2020@gmail.com](mailto:patrimonioesquecido2020@gmail.com)

# Develop

## Requirements

Lost Heritage was built using the [Quasar framework](https://quasar.dev) ([GitHub](https://github.com/quasarframework/quasar)), Node.JS and MongoDB.
The images are stored in an Amazon S3 Bucket. To develop, you will need the to install the following on your computer:

- Node.JS v14.10+

Clone this repository and navigate to the folder

```bash
$ git clone https://github.com/Digital-Initiative-Aveiro/lost-heritage-backend
$ cd lost-heritage-backend
```

## Backend

### Install the dependencies

```bash
$ cd backend
$ yarn install
```

### Start the app in development mode

```bash
$ yarn run start-devdev
```

# Contributing

This open source project is maintained by [Rui Lebre](http://www.ruilebre.com). Your contributions to the software are also welcome. For tech support, please prefer contacting the maintainers instead of creating an issue.

## Maintainers

- Rui Lebre - [@rlebre](https://github.com/rlebre)

## License

[GPL-3.0-only](https://spdx.org/licenses/GPL-3.0-only.html)

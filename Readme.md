# SharePoint / Office 365 Saturday Madrid 2018

En este repositorio podrás encontrar los materiales utilizados en el Workshop **ALM para soluciones basadas en SharePoint Framework** impartido durante el SharePoint / Office 365 Saturday Madrid 2018.

## Ponentes
1. Adrián Díaz - MS Office Development MVP [@AdrianDiaz81](https://twitter.com/AdrianDiaz81)
2. Luis Máñez - MS Office Development MVP [@LuisManez](https://twitter.com/luismanez)

# ALM para soluciones basadas en SharePoint Framework

## Pre-requisitos

Para completar el workshop, previamente se debe configurar tanto la tenant de Office 365, como el entorno local. Para ello se recomienda seguir los siguientes artículos:

1. [Setup your Office 365 Tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
2. [Set up your SharePoint Framework development environment](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment)
3. [Instalar los comandos para SharePoint Online de PowerShell](https://go.microsoft.com/fwlink/p/?LinkId=255251)
4. [Instalar PnP PowerShell Commands](https://github.com/SharePoint/PnP-PowerShell)

Para el propósito del Workshop, vamos a hacer Deploy de la solución spfx a nivel de Site Collection App Catalog. Existen dos opciones para el Deploy de nuestras soluciones spfx: 

1. Hacerlo a nivel de Tenant App Catalog. Esto nos permite poder instalar nuestra solución en cualquier site collection de nuestr Tenant.
2. Hacerlo a nivel de Site Collection App Catalog. De esta forma, nuestra solución sólo estará disponible a nivel de la site collection donde se ha desplegado. Puedes saber más en [Use the site collection app catalog](https://docs.microsoft.com/en-us/sharepoint/dev/general-development/site-collection-app-catalog)

Ambas opciones tienen sus ventajas e inconvenientes. En este caso lo haremos a nivel de Site Collection, que nos va a ofrecer un nivel de aislamiento mayor, donde por ejemplo, si tenemos varios desarrolladores trabajando sobre la misma Tenant de Office 365, cada uno va a poder desplegar su solucion de forma independiente, probando así varias versiones sin conflicto con otros desarrolladores.

Para poder utilizar el App Catalog a nivel de Site Collection, primero vamos a tener que configurarlo. Para ello podemos ejecutar lso siguientes comandos:

```ps
Connect-SPOService -Url TENANT-ADMIN-SITE-URL

Add-SPOSiteCollectionAppCatalog -Site URL-TO-TARGET-SITE-COLLECTION
```

Como último pre-requisito, vamos a necesitar configurar el CDN público de Office 365, ya que lo necesitaremos para hospedar los scripts de nuestra solución spfx. Para ello, asegúrate de ejecutar el comando:

```ps
Set-SPOTenantCdnEnabled -CdnType Public
```

**Nota**: Una vez ejecutado el comando anterior, llevará algo de tiempo hasta que realmente queda configurado, puedes ver el estado del CDN con el comando _Get-SPOTenantCdnOrigins -CdnType Public_

![public-cdn](./assets/public-cdn.png)

A la hora de hospedar nuestros scripts, tenemos varias opciones:
1. Podemos utilizar el CDN de Azure, incluso otros servicios CDN (Cloudflare, Amazon, etc)
2. Cualquier biblioteca de SharePoint. En este caso no te beneficias de las ventajas de un CDN
3. Puedes configurar cualquier biblioteca de SharePoint para que funcione con un CDN (puedes hacerlo con los mismos comandos de PS anteriores, pero apuntando a las bibliotecas de SP que quieras configurar como CDN)
4. Utilizar el CDN 'Automático' de Office 365. Similar al punto anterior, pero utilizando el CDN por defecto de Office 365 (*/CLIENTSIDEASSETS). Esto nos va a facilitar el Deploy de nuestra solución, ya que luego haremos uso de la property _includeClientSideAssets_ para desplegar nuestros scripts directamente al CDN por defecto.

## Spfx webpart

Para continuar con el workshop, tenemos que crear nuestra solución spfx. Para ello vamos a crear un proyecto webpart haciendo uso del generador de Yeoman para spfx.

Para agilizar el proceso, recomendamos que clones el repositorio en tu local 
// TODO

Si ejecutamos el webpart en el local workbench, veremos un simple webpart que muestra la versión 1.0.0 (luego cambiaremos esto para ver como versionar webparts y actualizar soluciones ya desplegadas)

## Deployment a SharePoint

Una vez tenemos nuestra solución spfx, ya podemos continuar con el proceso de Deploy a SharePoint. De nuevo, en este punto tenemos diferentes opciones:

1. ALM APIs: Por fin Microsoft ofrece unas APIs para facilitar procesos de ALM con soluciones SharePoint. Durante el workshop veremos con más detalle estas APIs. Puedes saber más en este link [Application Lifecycle Management (ALM) APIs](https://docs.microsoft.com/en-us/sharepoint/dev/apis/alm-api-for-spfx-add-ins)
2. [Comandos PnP PowerShell](https://docs.microsoft.com/en-us/sharepoint/dev/apis/alm-api-for-spfx-add-ins#sharepoint-pnp-powershell-cmdlets). Disponemos de varios comandos PowerShell de la gente del PnP para procesos ALM. Al final estos comandos son simples _wrappers_ de la ALM API
3. [node-sp-alm package](https://www.npmjs.com/package/node-sp-alm). Esto es un paquete npm con acciones para procesos de ALM. De nuevo, nos es más que otro _wrapper_ alrededor de la ALM API, en este caso basado en Node, por lo que podemos utilizarlo para extender la toolchain del spfx.
4. [Office 365 Cli commands](https://docs.microsoft.com/en-us/sharepoint/dev/apis/alm-api-for-spfx-add-ins#office-365-cli-commands-to-add-deploy-and-manage-sharepoint-apps-cross-platform). Un _wrapper_ más, en este caso un CLI cross-platform, por lo que podríamos usarlo desde Linux o Mac.
5. Proceso manual a través de la IU de SharePoint.

Como hemos dicho, veremos más adelante las ALM APis, así que en este punto vamos a ver como ayudarnos de los comandos PS del PnP para hacer la instalación.

Antes de nada, tenemos que preparar el paquete de la solución spfx, para ello tenemos que ejecutar los siguientes comandos de _gulp_

```js
gulp bundle --ship

gulp package-solution --ship
```

Esto nos va a generar un fichero _/sharepoint/solution/spfx-alm.sppkg_ que contendrá la definición de la App, así como los scripts (ficheros js) y assets incluídos en la solución.

__Nota__: Recuerda que estamos utilizando la opción del CDN Automático de SharePoint para hospedar los ficheros JS y assets de la solución. Con esta opción, los ficheros se incluyen en el propio .sppkg. Si utilizas otro CDN, entonces tienes que copiar los ficheros JS y assets generados en la carpeta _temp/deploy_ a tu CDN.

Ejecuta los siguientes comandos para Desplegar e Instalar la solucion spfx en SharePoint:

```ps
Connect-PnPOnline -Url [SITE_COLLECTION_URL]

$app = Add-PnPApp -Path "[FULL_PATH]\sharepoint\solution\spfx-alm.sppkg" -Scope Site -Publish -Overwrite -Publish

Install-PnPApp -Identity $app.Id -Scope Site
```
El proceso de instalación de la App es asíncrono, por lo que puede llevar varios minutos hasta que realmente esté disponible. Puedes comprobar el estado de la app desde el comando _Get-PnPApp_ en su propiedad _InstalledVersion_.

Una vez desplegada e instalada la solución, puedes editar cualquier página y añadir el webpart:

![webpart](./assets/webpart.png)

## Update Solution

Para probar el proceso de _update_, primero vamos a cambiar la versión de nuestra solución. Para ello:
1. Edita el fichero _package.json_ y actualiza la propiedad _version_ a "2.0.0"
2. Edita el fichero _config/package_solution_ y actualiza _version_ a "2.0.0.0" (fíjate que en este caso la versión contiene 4 números. Esto es porque SharePoint no utiliza _semver_ para el versionado. Se recomienda que utilices el mismo número que en el punto anterior, poniendo el último dígito a cero, para asi coincidir con la versión del _package.json_)
3. Edita el webpart para que pinte la versión actualizada:

```xml
<p className={ styles.subTitle }>Version: 2.0.0</p>
```

Una vez actualizadas las versiones en el código fuente, debemos volver a generar el paquete con los comandos de _gulp_ (podemos lanzar varios comandos a la vez utilizando _&&_)

```js
gulp bundle --ship && gulp package-solution --ship
```

Una vez generado el nuevo .sppkg, podemos actualizar la versión con los comandos del PnP. Primero desinstalamos la versión existente:

```ps
$app = Get-PnPApp -scope site | where { $_.Title -eq 'spfx-alm-client-side-solution' }

Uninstall-PnPApp -Identity $app.Id -Scope Site
```

La desinstalación de la App es un proceso asíncrono, por lo que puede llevar varios minutos hasta que realmente esté desinstalada. Puedes comprobar el estado de la app desde el comando _Get-PnPApp_ en su propiedad _InstalledVersion_.

Una vez desinstalada la App, podemos repetir el proceso de instalación para actualizar a la nueva versión. Si lo hacemos, y refrescamos la página con el webpart, veremos como aparece la nueva

### Extendiendo la toolchain con procesos ALM

Como complemento, en el fichero _./pipeline/sp-deploy.js_ se ha creado una tarea _gulp_ que despliega e instala la solución utilizando el paquete de npm _node-sp-alm package_

__Nota__: La tarea no está completa, y queda como posible futuro ejercicio el completarla para que soporte la actualización del paquete.
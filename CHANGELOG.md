
<a name="v0.7.2"></a>

## [v0.7.2](https://github.com/openhotel/openhotel/compare/v0.7.1...v0.7.2) (2025-05-20)

### Bug Fixes

- fixed incorrect zIndex on character, tiles, walls... - fix [#933](https://github.com/openhotel/openhotel/issues/933) & fix [#793](https://github.com/openhotel/openhotel/issues/793) ([#941](https://github.com/openhotel/openhotel/issues/941))
- pixel on inventory modal - fix [#938](https://github.com/openhotel/openhotel/issues/938) ([#939](https://github.com/openhotel/openhotel/issues/939))

### Features

- place furniture into the room from inventory - fix [#909](https://github.com/openhotel/openhotel/issues/909) ([#918](https://github.com/openhotel/openhotel/issues/918))


<a name="v0.7.1"></a>

## [v0.7.1](https://github.com/openhotel/openhotel/compare/v0.7.0...v0.7.1) (2025-05-19)

### Bug Fixes

- scroll doesn't render correctly on create room - fix [#935](https://github.com/openhotel/openhotel/issues/935) ([#937](https://github.com/openhotel/openhotel/issues/937))
- multiple characters on room animations broke - fix [#927](https://github.com/openhotel/openhotel/issues/927) ([#936](https://github.com/openhotel/openhotel/issues/936))
- reverted rendering tasks because of dependencies ([#932](https://github.com/openhotel/openhotel/issues/932))
- room title overflows + limit max title and description - fix [#929](https://github.com/openhotel/openhotel/issues/929) ([#931](https://github.com/openhotel/openhotel/issues/931))
- Fix rerendering tasks because of dependencies - fix [#927](https://github.com/openhotel/openhotel/issues/927) ([#928](https://github.com/openhotel/openhotel/issues/928))

### Features

- add the-people frame - fix [#924](https://github.com/openhotel/openhotel/issues/924) ([#934](https://github.com/openhotel/openhotel/issues/934))


<a name="v0.7.0"></a>

## [v0.7.0](https://github.com/openhotel/openhotel/compare/v0.6.11...v0.7.0) (2025-05-16)

### Bug Fixes

- teleport triggering animation - fix [#912](https://github.com/openhotel/openhotel/issues/912) ([#914](https://github.com/openhotel/openhotel/issues/914))
- Maximum update depth on loader-assets - fix [#905](https://github.com/openhotel/openhotel/issues/905) ([#906](https://github.com/openhotel/openhotel/issues/906))
- double click from button - fix [#893](https://github.com/openhotel/openhotel/issues/893) ([#897](https://github.com/openhotel/openhotel/issues/897))
- kill browser after not being in use after x seconds - fix [#889](https://github.com/openhotel/openhotel/issues/889) ([#890](https://github.com/openhotel/openhotel/issues/890))
- economy transactions lacking some atomization - fix [#882](https://github.com/openhotel/openhotel/issues/882) ([#888](https://github.com/openhotel/openhotel/issues/888))
- maxUsers on private room migration - fix [#883](https://github.com/openhotel/openhotel/issues/883) ([#886](https://github.com/openhotel/openhotel/issues/886))
- shadow on character preview is above character - fix [#884](https://github.com/openhotel/openhotel/issues/884) ([#885](https://github.com/openhotel/openhotel/issues/885))
- input maks being incorrect - fix [#874](https://github.com/openhotel/openhotel/issues/874) ([#879](https://github.com/openhotel/openhotel/issues/879))
- room camera movement - fix [#875](https://github.com/openhotel/openhotel/issues/875) ([#878](https://github.com/openhotel/openhotel/issues/878))
- created by text is not positioned correctly the first time - fix [#873](https://github.com/openhotel/openhotel/issues/873) ([#877](https://github.com/openhotel/openhotel/issues/877))

### Features

- added room creator - fix [#763](https://github.com/openhotel/openhotel/issues/763) ([#926](https://github.com/openhotel/openhotel/issues/926))
- added token command + expose camera photos list - fix [#923](https://github.com/openhotel/openhotel/issues/923) ([#925](https://github.com/openhotel/openhotel/issues/925))
- added selector component - fix [#920](https://github.com/openhotel/openhotel/issues/920) ([#922](https://github.com/openhotel/openhotel/issues/922))
- added input component - fix [#919](https://github.com/openhotel/openhotel/issues/919) ([#921](https://github.com/openhotel/openhotel/issues/921))
- private room mini render layout ([#916](https://github.com/openhotel/openhotel/issues/916))
- render inventory - fix [#817](https://github.com/openhotel/openhotel/issues/817) ([#876](https://github.com/openhotel/openhotel/issues/876))
- added "render-preference" as a prop inside localstorage to load with WebGL if necessary - fix [#904](https://github.com/openhotel/openhotel/issues/904) ([#908](https://github.com/openhotel/openhotel/issues/908))
- add howler.js for sound management - fix [#902](https://github.com/openhotel/openhotel/issues/902) ([#903](https://github.com/openhotel/openhotel/issues/903))
- add do not merge analyzer - fix [#895](https://github.com/openhotel/openhotel/issues/895) ([#896](https://github.com/openhotel/openhotel/issues/896))
- make purse bigger - fix [#841](https://github.com/openhotel/openhotel/issues/841) ([#894](https://github.com/openhotel/openhotel/issues/894))
- add work contracts - fix [#832](https://github.com/openhotel/openhotel/issues/832) ([#858](https://github.com/openhotel/openhotel/issues/858))
- migrate private rooms layouts to index - fix [#762](https://github.com/openhotel/openhotel/issues/762) ([#865](https://github.com/openhotel/openhotel/issues/865))
- add autowidth to buttons - fix [#829](https://github.com/openhotel/openhotel/issues/829) ([#880](https://github.com/openhotel/openhotel/issues/880))
- prevent rendering modals when are not loaded - fix [#856](https://github.com/openhotel/openhotel/issues/856) ([#872](https://github.com/openhotel/openhotel/issues/872))
- add character shadow - fix [#870](https://github.com/openhotel/openhotel/issues/870) ([#871](https://github.com/openhotel/openhotel/issues/871))


<a name="v0.6.11"></a>

## [v0.6.11](https://github.com/openhotel/openhotel/compare/v0.6.10...v0.6.11) (2025-05-07)

### Bug Fixes

- phantom misaligned - fix [#866](https://github.com/openhotel/openhotel/issues/866) ([#867](https://github.com/openhotel/openhotel/issues/867))
- scroll when children is updated - fix [#840](https://github.com/openhotel/openhotel/issues/840) ([#862](https://github.com/openhotel/openhotel/issues/862))

### Features

- navigator search tweaks - fix [#868](https://github.com/openhotel/openhotel/issues/868) ([#869](https://github.com/openhotel/openhotel/issues/869))
- search bar on navigator - fix [#855](https://github.com/openhotel/openhotel/issues/855) ([#861](https://github.com/openhotel/openhotel/issues/861))


<a name="v0.6.10"></a>

## [v0.6.10](https://github.com/openhotel/openhotel/compare/v0.6.9...v0.6.10) (2025-05-06)

### Bug Fixes

- navigator not being refreshed - fix [#859](https://github.com/openhotel/openhotel/issues/859) ([#860](https://github.com/openhotel/openhotel/issues/860))
- update dependency array in useEffect for language provider - fix [#849](https://github.com/openhotel/openhotel/issues/849) ([#853](https://github.com/openhotel/openhotel/issues/853))
- set user balance only if credits are null - fix [#846](https://github.com/openhotel/openhotel/issues/846) ([#847](https://github.com/openhotel/openhotel/issues/847))
- check phantom config in capture function ([#845](https://github.com/openhotel/openhotel/issues/845))

### Features

- improved performance and prevented rerenders - fix [#782](https://github.com/openhotel/openhotel/issues/782) ([#854](https://github.com/openhotel/openhotel/issues/854))
- add companies module - fix [#831](https://github.com/openhotel/openhotel/issues/831) ([#851](https://github.com/openhotel/openhotel/issues/851))
- add hover color on buttons - fix [#848](https://github.com/openhotel/openhotel/issues/848) ([#850](https://github.com/openhotel/openhotel/issues/850))


<a name="v0.6.9"></a>

## [v0.6.9](https://github.com/openhotel/openhotel/compare/v0.6.8...v0.6.9) (2025-05-02)

### Bug Fixes

- incorrect padding on left and right on purse - fix [#842](https://github.com/openhotel/openhotel/issues/842) ([#843](https://github.com/openhotel/openhotel/issues/843))
- purse title color - fix [#837](https://github.com/openhotel/openhotel/issues/837) ([#839](https://github.com/openhotel/openhotel/issues/839))
- character hitbox - fix [#808](https://github.com/openhotel/openhotel/issues/808) ([#820](https://github.com/openhotel/openhotel/issues/820))

### Code Refactoring

- client internationalization - fix [#783](https://github.com/openhotel/openhotel/issues/783) [#825](https://github.com/openhotel/openhotel/issues/825) ([#812](https://github.com/openhotel/openhotel/issues/812))

### Features

- change i18n to work as a provider + retrieve lang from auth - fix [#836](https://github.com/openhotel/openhotel/issues/836) ([#838](https://github.com/openhotel/openhotel/issues/838))
- update furniture prices and add coin icon - fix [#819](https://github.com/openhotel/openhotel/issues/819) ([#824](https://github.com/openhotel/openhotel/issues/824))
- check if catalog is available when buying furniture - fix [#822](https://github.com/openhotel/openhotel/issues/822) ([#823](https://github.com/openhotel/openhotel/issues/823))
- add purse transaction when buying furniture - fix [#802](https://github.com/openhotel/openhotel/issues/802) ([#821](https://github.com/openhotel/openhotel/issues/821))
- add purse title - fix [#809](https://github.com/openhotel/openhotel/issues/809) ([#815](https://github.com/openhotel/openhotel/issues/815))
- add scroll to transaction list in purse component - fix [#805](https://github.com/openhotel/openhotel/issues/805) ([#811](https://github.com/openhotel/openhotel/issues/811))


<a name="v0.6.8"></a>

## [v0.6.8](https://github.com/openhotel/openhotel/compare/v0.6.7...v0.6.8) (2025-04-30)

### Bug Fixes

- room previews - fix [#806](https://github.com/openhotel/openhotel/issues/806) ([#807](https://github.com/openhotel/openhotel/issues/807))

### Features

- update transaction date formatting to use dayjs - fix [#801](https://github.com/openhotel/openhotel/issues/801) ([#803](https://github.com/openhotel/openhotel/issues/803))


<a name="v0.6.7"></a>

## [v0.6.7](https://github.com/openhotel/openhotel/compare/v0.6.6...v0.6.7) (2025-04-30)

### Bug Fixes

- added puppeteer deps - fix [#796](https://github.com/openhotel/openhotel/issues/796) ([#797](https://github.com/openhotel/openhotel/issues/797))
- incorrect character spawn wall zIndex - fix [#786](https://github.com/openhotel/openhotel/issues/786) ([#792](https://github.com/openhotel/openhotel/issues/792))
- disable fake inventory-ish - fix [#790](https://github.com/openhotel/openhotel/issues/790) ([#791](https://github.com/openhotel/openhotel/issues/791))
- chat input text overflows input box - fix [#780](https://github.com/openhotel/openhotel/issues/780) ([#789](https://github.com/openhotel/openhotel/issues/789))

### Features

- implement navigator preview with phantom - fix [#787](https://github.com/openhotel/openhotel/issues/787) ([#798](https://github.com/openhotel/openhotel/issues/798))
- update transaction texture to background-circle-x6 - fix [#799](https://github.com/openhotel/openhotel/issues/799) ([#800](https://github.com/openhotel/openhotel/issues/800))
- add local economy - fix [#662](https://github.com/openhotel/openhotel/issues/662) ([#705](https://github.com/openhotel/openhotel/issues/705))
- load catalog directly from file + category range activation - fix [#794](https://github.com/openhotel/openhotel/issues/794) ([#795](https://github.com/openhotel/openhotel/issues/795))
- added command /photo and SSR screenshots for private rooms - fix [#772](https://github.com/openhotel/openhotel/issues/772) ([#784](https://github.com/openhotel/openhotel/issues/784))


<a name="v0.6.6"></a>

## [v0.6.6](https://github.com/openhotel/openhotel/compare/v0.6.5...v0.6.6) (2025-04-26)

### Bug Fixes

- last catalog sprite - fix [#779](https://github.com/openhotel/openhotel/issues/779) ([#785](https://github.com/openhotel/openhotel/issues/785))

### Features

- added safe window width on large monitors - fix [#773](https://github.com/openhotel/openhotel/issues/773) ([#778](https://github.com/openhotel/openhotel/issues/778))


<a name="v0.6.5"></a>

## [v0.6.5](https://github.com/openhotel/openhotel/compare/v0.6.4...v0.6.5) (2025-04-24)

### Bug Fixes

- contributors with prettier - fix [#776](https://github.com/openhotel/openhotel/issues/776) ([#777](https://github.com/openhotel/openhotel/issues/777))

### Features

- add contributors as a cron job on github actions once a day - fix [#759](https://github.com/openhotel/openhotel/issues/759) ([#775](https://github.com/openhotel/openhotel/issues/775))


<a name="v0.6.4"></a>

## [v0.6.4](https://github.com/openhotel/openhotel/compare/v0.6.3...v0.6.4) (2025-04-24)

### Bug Fixes

- prevent selecting unloaded furniture - fix [#716](https://github.com/openhotel/openhotel/issues/716) ([#769](https://github.com/openhotel/openhotel/issues/769))
- clear preview when traveling between rooms - fix [#765](https://github.com/openhotel/openhotel/issues/765) ([#767](https://github.com/openhotel/openhotel/issues/767))

### Features

- added catalog - fix [#523](https://github.com/openhotel/openhotel/issues/523) ([#749](https://github.com/openhotel/openhotel/issues/749))
- improve camera movement - fix [#770](https://github.com/openhotel/openhotel/issues/770) ([#771](https://github.com/openhotel/openhotel/issues/771))
- simplify set command to last clicked tile with shift or wall point - fix [#761](https://github.com/openhotel/openhotel/issues/761) ([#766](https://github.com/openhotel/openhotel/issues/766))


<a name="v0.6.3"></a>

## [v0.6.3](https://github.com/openhotel/openhotel/compare/v0.6.2...v0.6.3) (2025-04-16)

### Features

- added cake furniture - fix [#714](https://github.com/openhotel/openhotel/issues/714) ([#764](https://github.com/openhotel/openhotel/issues/764))
- added storybook build checks - fix [#741](https://github.com/openhotel/openhotel/issues/741) ([#760](https://github.com/openhotel/openhotel/issues/760))
- move version after fps on f1 - fix [#757](https://github.com/openhotel/openhotel/issues/757) ([#758](https://github.com/openhotel/openhotel/issues/758))


<a name="v0.6.2"></a>

## [v0.6.2](https://github.com/openhotel/openhotel/compare/v0.6.1...v0.6.2) (2025-04-14)

### Bug Fixes

- Navigator reopening after closing - fix [#745](https://github.com/openhotel/openhotel/issues/745) ([#753](https://github.com/openhotel/openhotel/issues/753))

### Features

- animate walk movement - fix [#722](https://github.com/openhotel/openhotel/issues/722) ([#754](https://github.com/openhotel/openhotel/issues/754))
- ignore bots from changelog - fix [#750](https://github.com/openhotel/openhotel/issues/750) ([#751](https://github.com/openhotel/openhotel/issues/751))
- change changelog auto pr to automatic commit to master - fix [#746](https://github.com/openhotel/openhotel/issues/746)  ([#747](https://github.com/openhotel/openhotel/issues/747))


<a name="v0.6.1"></a>

## [v0.6.1](https://github.com/openhotel/openhotel/compare/v0.6.0...v0.6.1) (2025-04-11)

### Bug Fixes

- prevent room from changing size when furniture is placed - fix [#732](https://github.com/openhotel/openhotel/issues/732) ([#740](https://github.com/openhotel/openhotel/issues/740))
- add chat message length limit - fix [#721](https://github.com/openhotel/openhotel/issues/721) ([#731](https://github.com/openhotel/openhotel/issues/731))

### Features

- added navigator scroll - fix [#730](https://github.com/openhotel/openhotel/issues/730) ([#742](https://github.com/openhotel/openhotel/issues/742))
- add camera movement in rooms - fix [#720](https://github.com/openhotel/openhotel/issues/720) ([#736](https://github.com/openhotel/openhotel/issues/736))
- update pixi-components dependency - fix [#737](https://github.com/openhotel/openhotel/issues/737)  ([#738](https://github.com/openhotel/openhotel/issues/738))


<a name="v0.6.0"></a>

## [v0.6.0](https://github.com/openhotel/openhotel/compare/v0.5.33...v0.6.0) (2025-04-10)

### Bug Fixes

- reset users last message - fix [#679](https://github.com/openhotel/openhotel/issues/679) ([#697](https://github.com/openhotel/openhotel/issues/697))

### Code Refactoring

- changed client renderer from tulip to pixi react - fix [#688](https://github.com/openhotel/openhotel/issues/688) ([#700](https://github.com/openhotel/openhotel/issues/700))
- rooms game system to allow public/private rooms - fix [#693](https://github.com/openhotel/openhotel/issues/693) ([#645](https://github.com/openhotel/openhotel/issues/645))

### Features

- migrate uuid to ulid - fix [#676](https://github.com/openhotel/openhotel/issues/676) ([#699](https://github.com/openhotel/openhotel/issues/699))
- implement docker configuration for server and client services ([#696](https://github.com/openhotel/openhotel/issues/696))


<a name="v0.5.33"></a>

## [v0.5.33](https://github.com/openhotel/openhotel/compare/v0.5.32...v0.5.33) (2025-02-28)

### Bug Fixes

- remove fingerprint from ping and improvements - fix [#691](https://github.com/openhotel/openhotel/issues/691) ([#692](https://github.com/openhotel/openhotel/issues/692))


<a name="v0.5.32"></a>

## [v0.5.32](https://github.com/openhotel/openhotel/compare/v0.5.31...v0.5.32) (2025-02-28)

### Bug Fixes

- accept pinf from fingerprint - fix [#685](https://github.com/openhotel/openhotel/issues/685) ([#686](https://github.com/openhotel/openhotel/issues/686))
- texture of stairs missing few pixels - fix [#671](https://github.com/openhotel/openhotel/issues/671) ([#678](https://github.com/openhotel/openhotel/issues/678))
- remove reference tile - fix [#673](https://github.com/openhotel/openhotel/issues/673) ([#674](https://github.com/openhotel/openhotel/issues/674))
- private rooms not centered - fix [#665](https://github.com/openhotel/openhotel/issues/665) ([#672](https://github.com/openhotel/openhotel/issues/672))
- cannot place flags on corner or spawn door - fix [#663](https://github.com/openhotel/openhotel/issues/663) ([#667](https://github.com/openhotel/openhotel/issues/667))
- incorrect room displacement when placing flags - fix [#628](https://github.com/openhotel/openhotel/issues/628) ([#664](https://github.com/openhotel/openhotel/issues/664))
- allow touchevents to stop dragging - fix [#648](https://github.com/openhotel/openhotel/issues/648) ([#659](https://github.com/openhotel/openhotel/issues/659))
- prevent set incorrect frame direction - fix [#649](https://github.com/openhotel/openhotel/issues/649) ([#650](https://github.com/openhotel/openhotel/issues/650))

### Features

- add first version of room creation menu - fix [#274](https://github.com/openhotel/openhotel/issues/274) ([#657](https://github.com/openhotel/openhotel/issues/657))
- correct literal error demo room - fix [#668](https://github.com/openhotel/openhotel/issues/668) ([#669](https://github.com/openhotel/openhotel/issues/669))
- add cache changelog - fix [#655](https://github.com/openhotel/openhotel/issues/655) ([#656](https://github.com/openhotel/openhotel/issues/656))
- add /changelog request - fix [#653](https://github.com/openhotel/openhotel/issues/653) ([#654](https://github.com/openhotel/openhotel/issues/654))
- add changelog modal - fix [#611](https://github.com/openhotel/openhotel/issues/611) ([#642](https://github.com/openhotel/openhotel/issues/642))


<a name="v0.5.31"></a>

## [v0.5.31](https://github.com/openhotel/openhotel/compare/v0.5.30...v0.5.31) (2025-02-09)

### Bug Fixes

- drag room not working on phones/tablets - fix [#643](https://github.com/openhotel/openhotel/issues/643) ([#644](https://github.com/openhotel/openhotel/issues/644))
- prevent clients without a user from being alive, kill those bastards - fix [#636](https://github.com/openhotel/openhotel/issues/636) ([#641](https://github.com/openhotel/openhotel/issues/641))
- prevent invalid reposition on humans when focus is out - fix [#638](https://github.com/openhotel/openhotel/issues/638) ([#639](https://github.com/openhotel/openhotel/issues/639))
- remove bounds from furniture in favor of size - fix [#632](https://github.com/openhotel/openhotel/issues/632) ([#633](https://github.com/openhotel/openhotel/issues/633))
- incorrect message pivot - fix [#612](https://github.com/openhotel/openhotel/issues/612) ([#631](https://github.com/openhotel/openhotel/issues/631))
- chat history not saving old duplicated elements - fix [#624](https://github.com/openhotel/openhotel/issues/624) ([#629](https://github.com/openhotel/openhotel/issues/629))
- flags set with sizes - fix [#625](https://github.com/openhotel/openhotel/issues/625) ([#627](https://github.com/openhotel/openhotel/issues/627))
- ignore prettier on changelog - fix [#620](https://github.com/openhotel/openhotel/issues/620) ([#622](https://github.com/openhotel/openhotel/issues/622))

### Features

- added reply command to whispering - fix [#623](https://github.com/openhotel/openhotel/issues/623) ([#630](https://github.com/openhotel/openhotel/issues/630))


<a name="v0.5.30"></a>

## [v0.5.30](https://github.com/openhotel/openhotel/compare/v0.5.29...v0.5.30) (2025-02-04)

### Bug Fixes

- proxy exposing wrong version - fix [#617](https://github.com/openhotel/openhotel/issues/617) ([#618](https://github.com/openhotel/openhotel/issues/618))


<a name="v0.5.29"></a>

## [v0.5.29](https://github.com/openhotel/openhotel/compare/v0.5.28...v0.5.29) (2025-02-04)


<a name="v0.5.28"></a>

## [v0.5.28](https://github.com/openhotel/openhotel/compare/v0.5.27...v0.5.28) (2025-02-04)

### Bug Fixes

- disable camera on modal click - fix [#587](https://github.com/openhotel/openhotel/issues/587) ([#597](https://github.com/openhotel/openhotel/issues/597))
- human jumps when moving - fix [#603](https://github.com/openhotel/openhotel/issues/603)  ([#605](https://github.com/openhotel/openhotel/issues/605))
- human jumps when moving - fix [#603](https://github.com/openhotel/openhotel/issues/603) ([#604](https://github.com/openhotel/openhotel/issues/604))

### Features

- expose hotel info - fix [#613](https://github.com/openhotel/openhotel/issues/613) ([#615](https://github.com/openhotel/openhotel/issues/615))
- expose hotel info - fix [#613](https://github.com/openhotel/openhotel/issues/613) ([#614](https://github.com/openhotel/openhotel/issues/614))
- save last version played - fix [#600](https://github.com/openhotel/openhotel/issues/600) ([#610](https://github.com/openhotel/openhotel/issues/610))
- limit frames on X position and fixed frameIsometricPosition calc - fix [#607](https://github.com/openhotel/openhotel/issues/607) ([#608](https://github.com/openhotel/openhotel/issues/608))
- add stairs tile preview - fix [#588](https://github.com/openhotel/openhotel/issues/588) ([#590](https://github.com/openhotel/openhotel/issues/590))


<a name="v0.5.27"></a>

## [v0.5.27](https://github.com/openhotel/openhotel/compare/v0.5.26...v0.5.27) (2025-01-28)

### Bug Fixes

- set position to 0,0 on room mount - fix [#584](https://github.com/openhotel/openhotel/issues/584) ([#585](https://github.com/openhotel/openhotel/issues/585))

### Features

- frame objects cannot exceed walls - fix [#483](https://github.com/openhotel/openhotel/issues/483) ([#579](https://github.com/openhotel/openhotel/issues/579))


<a name="v0.5.26"></a>

## [v0.5.26](https://github.com/openhotel/openhotel/compare/v0.5.25...v0.5.26) (2025-01-26)

### Features

- add camera panning with constraints - fix [#574](https://github.com/openhotel/openhotel/issues/574) ([#575](https://github.com/openhotel/openhotel/issues/575))


<a name="v0.5.25"></a>

## [v0.5.25](https://github.com/openhotel/openhotel/compare/v0.5.24...v0.5.25) (2025-01-25)

### Features

- filter help command list by user role - fix [#577](https://github.com/openhotel/openhotel/issues/577) ([#578](https://github.com/openhotel/openhotel/issues/578))
- add whisper command - fix [#567](https://github.com/openhotel/openhotel/issues/567) ([#576](https://github.com/openhotel/openhotel/issues/576))


<a name="v0.5.24"></a>

## [v0.5.24](https://github.com/openhotel/openhotel/compare/v0.5.23...v0.5.24) (2025-01-24)

### Features

- bump yarn to v4 - fix [#568](https://github.com/openhotel/openhotel/issues/568) ([#569](https://github.com/openhotel/openhotel/issues/569))
- add demo command by room - fix [#564](https://github.com/openhotel/openhotel/issues/564) ([#565](https://github.com/openhotel/openhotel/issues/565))


<a name="v0.5.23"></a>

## [v0.5.23](https://github.com/openhotel/openhotel/compare/v0.5.22...v0.5.23) (2025-01-24)

### Bug Fixes

- contributors build throwing an error - fix [#561](https://github.com/openhotel/openhotel/issues/561) ([#562](https://github.com/openhotel/openhotel/issues/562))


<a name="v0.5.22"></a>

## [v0.5.22](https://github.com/openhotel/openhotel/compare/v0.5.21...v0.5.22) (2025-01-23)

### Bug Fixes

- remove kick for op users - fix [#557](https://github.com/openhotel/openhotel/issues/557) ([#560](https://github.com/openhotel/openhotel/issues/560))
- teleport remote command not working - fix [#558](https://github.com/openhotel/openhotel/issues/558) ([#559](https://github.com/openhotel/openhotel/issues/559))

### Features

- add demo command - fix [#439](https://github.com/openhotel/openhotel/issues/439) ([#552](https://github.com/openhotel/openhotel/issues/552))


<a name="v0.5.21"></a>

## [v0.5.21](https://github.com/openhotel/openhotel/compare/v0.5.20...v0.5.21) (2025-01-17)

### Bug Fixes

- build - fix [#547](https://github.com/openhotel/openhotel/issues/547) ([#549](https://github.com/openhotel/openhotel/issues/549))


<a name="v0.5.20"></a>

## [v0.5.20](https://github.com/openhotel/openhotel/compare/v0.5.19...v0.5.20) (2025-01-17)

### Bug Fixes

- build - fix [#547](https://github.com/openhotel/openhotel/issues/547) ([#548](https://github.com/openhotel/openhotel/issues/548))


<a name="v0.5.19"></a>

## [v0.5.19](https://github.com/openhotel/openhotel/compare/v0.5.18...v0.5.19) (2025-01-17)

### Bug Fixes

- furniture preview - fix [#433](https://github.com/openhotel/openhotel/issues/433) ([#546](https://github.com/openhotel/openhotel/issues/546))
- calculate contributors order first by creator, then by contributions - #fix 536 ([#543](https://github.com/openhotel/openhotel/issues/543))
- teleport not having a size - fix [#520](https://github.com/openhotel/openhotel/issues/520) ([#538](https://github.com/openhotel/openhotel/issues/538))
- zindex by taking into account the 'below' tile + zIndex with frames and humans - fix [#532](https://github.com/openhotel/openhotel/issues/532) fix [#429](https://github.com/openhotel/openhotel/issues/429) ([#533](https://github.com/openhotel/openhotel/issues/533))

### Features

- added custom build to not be upgraded by default - fix [#540](https://github.com/openhotel/openhotel/issues/540) ([#542](https://github.com/openhotel/openhotel/issues/542))
- disable auth and onet first time - fix [#539](https://github.com/openhotel/openhotel/issues/539) ([#541](https://github.com/openhotel/openhotel/issues/541))


<a name="v0.5.18"></a>

## [v0.5.18](https://github.com/openhotel/openhotel/compare/v0.5.17...v0.5.18) (2025-01-16)

### Features

- improved build scripts - fix [#535](https://github.com/openhotel/openhotel/issues/535) ([#535](https://github.com/openhotel/openhotel/issues/535))


<a name="v0.5.17"></a>

## [v0.5.17](https://github.com/openhotel/openhotel/compare/v0.5.16...v0.5.17) (2025-01-15)

### Features

- show contributors at the home screen - fix [#529](https://github.com/openhotel/openhotel/issues/529)  ([#530](https://github.com/openhotel/openhotel/issues/530))


<a name="v0.5.16"></a>

## [v0.5.16](https://github.com/openhotel/openhotel/compare/v0.5.15...v0.5.16) (2025-01-15)

### Bug Fixes

- memory leak when switching tabs - fix [#526](https://github.com/openhotel/openhotel/issues/526) ([#527](https://github.com/openhotel/openhotel/issues/527))


<a name="v0.5.15"></a>

## [v0.5.15](https://github.com/openhotel/openhotel/compare/v0.5.14...v0.5.15) (2025-01-13)

### Bug Fixes

- unset command with frames - fix [#517](https://github.com/openhotel/openhotel/issues/517) ([#518](https://github.com/openhotel/openhotel/issues/518))

### Features

- add minimal catalog with copiable ids ([#522](https://github.com/openhotel/openhotel/issues/522))
- better commands with expanded /help and 'usages' / 'descriptions' for each command ([#521](https://github.com/openhotel/openhotel/issues/521))
- limit set furniture positions - fix [#483](https://github.com/openhotel/openhotel/issues/483) ([#519](https://github.com/openhotel/openhotel/issues/519))


<a name="v0.5.14"></a>

## [v0.5.14](https://github.com/openhotel/openhotel/compare/v0.5.13...v0.5.14) (2025-01-06)

### Features

- added rotate/move command - fix [#514](https://github.com/openhotel/openhotel/issues/514) ([#515](https://github.com/openhotel/openhotel/issues/515))


<a name="v0.5.13"></a>

## [v0.5.13](https://github.com/openhotel/openhotel/compare/v0.5.12...v0.5.13) (2025-01-02)

### Bug Fixes

- disconnected screen not centered - fix [#487](https://github.com/openhotel/openhotel/issues/487) ([#511](https://github.com/openhotel/openhotel/issues/511))
- background not centered on start - fix [#494](https://github.com/openhotel/openhotel/issues/494) ([#510](https://github.com/openhotel/openhotel/issues/510))
- prevent clicking multiple times a teleport - fix [#508](https://github.com/openhotel/openhotel/issues/508) ([#509](https://github.com/openhotel/openhotel/issues/509))
- set command (furniture data map)- fix [#506](https://github.com/openhotel/openhotel/issues/506) ([#507](https://github.com/openhotel/openhotel/issues/507))


<a name="v0.5.12"></a>

## [v0.5.12](https://github.com/openhotel/openhotel/compare/v0.5.11...v0.5.12) (2025-01-02)

### Bug Fixes

- furniture not loading - fix [#501](https://github.com/openhotel/openhotel/issues/501) ([#503](https://github.com/openhotel/openhotel/issues/503))


<a name="v0.5.11"></a>

## [v0.5.11](https://github.com/openhotel/openhotel/compare/v0.5.10...v0.5.11) (2025-01-02)

### Bug Fixes

- module not found blob null - fix [#499](https://github.com/openhotel/openhotel/issues/499) ([#500](https://github.com/openhotel/openhotel/issues/500))


<a name="v0.5.10"></a>

## [v0.5.10](https://github.com/openhotel/openhotel/compare/v0.5.9...v0.5.10) (2025-01-02)

### Features

- Improved furniture system load - fix [#495](https://github.com/openhotel/openhotel/issues/495) ([#497](https://github.com/openhotel/openhotel/issues/497))


<a name="v0.5.9"></a>

## [v0.5.9](https://github.com/openhotel/openhotel/compare/v0.5.8...v0.5.9) (2024-12-26)

### Bug Fixes

- added migration to remove old furniture - fix [#492](https://github.com/openhotel/openhotel/issues/492) ([#493](https://github.com/openhotel/openhotel/issues/493))


<a name="v0.5.8"></a>

## [v0.5.8](https://github.com/openhotel/openhotel/compare/v0.5.7...v0.5.8) (2024-12-25)

### Bug Fixes

- wrong pivots on finish home animations - fix [#472](https://github.com/openhotel/openhotel/issues/472) ([#491](https://github.com/openhotel/openhotel/issues/491))
- vite proxy not working on windows - fix [#469](https://github.com/openhotel/openhotel/issues/469) ([#489](https://github.com/openhotel/openhotel/issues/489))

### Features

- added temporal/dummy furniture at start - fix [#478](https://github.com/openhotel/openhotel/issues/478) ([#488](https://github.com/openhotel/openhotel/issues/488))
- display current online users - fix [#301](https://github.com/openhotel/openhotel/issues/301) ([#486](https://github.com/openhotel/openhotel/issues/486))


<a name="v0.5.7"></a>

## [v0.5.7](https://github.com/openhotel/openhotel/compare/v0.5.6...v0.5.7) (2024-12-19)

### Bug Fixes

- resize not working - fix [#480](https://github.com/openhotel/openhotel/issues/480) ([#485](https://github.com/openhotel/openhotel/issues/485))

### Features

- added clear command - fix [#482](https://github.com/openhotel/openhotel/issues/482) ([#484](https://github.com/openhotel/openhotel/issues/484))


<a name="v0.5.6"></a>

## [v0.5.6](https://github.com/openhotel/openhotel/compare/v0.5.5...v0.5.6) (2024-12-17)

### Bug Fixes

- send human movement before remote teleport  - fix [#471](https://github.com/openhotel/openhotel/issues/471) ([#474](https://github.com/openhotel/openhotel/issues/474))
- prevent showing navigator modal when home is not mounted  - fix [#470](https://github.com/openhotel/openhotel/issues/470) ([#473](https://github.com/openhotel/openhotel/issues/473))

### Features

- dynamic furniture load + visual improvements - fix [#467](https://github.com/openhotel/openhotel/issues/467) ([#475](https://github.com/openhotel/openhotel/issues/475))


<a name="v0.5.5"></a>

## [v0.5.5](https://github.com/openhotel/openhotel/compare/v0.5.4...v0.5.5) (2024-12-16)

### Features

- added open animation to home - fix [#434](https://github.com/openhotel/openhotel/issues/434) ([#468](https://github.com/openhotel/openhotel/issues/468))
- added user logs on joined/left - fix [#453](https://github.com/openhotel/openhotel/issues/453) ([#466](https://github.com/openhotel/openhotel/issues/466))


<a name="v0.5.4"></a>

## [v0.5.4](https://github.com/openhotel/openhotel/compare/v0.5.3...v0.5.4) (2024-12-16)

### Bug Fixes

- flags direction east-north - fix [#460](https://github.com/openhotel/openhotel/issues/460) ([#464](https://github.com/openhotel/openhotel/issues/464))
- pathfinding stucks human when other human or furniture same position - fix [#458](https://github.com/openhotel/openhotel/issues/458) ([#462](https://github.com/openhotel/openhotel/issues/462))

### Features

- change uid to id in furniture + unset command with id - fix [#463](https://github.com/openhotel/openhotel/issues/463) ([#465](https://github.com/openhotel/openhotel/issues/465))
- change teleport link command to one command - fix [#457](https://github.com/openhotel/openhotel/issues/457)  ([#461](https://github.com/openhotel/openhotel/issues/461))
- add permanent ops from owners and admins - fix [#440](https://github.com/openhotel/openhotel/issues/440) ([#454](https://github.com/openhotel/openhotel/issues/454))


<a name="v0.5.3"></a>

## [v0.5.3](https://github.com/openhotel/openhotel/compare/v0.5.2...v0.5.3) (2024-12-13)

### Features

- process meta to all users - fix [#451](https://github.com/openhotel/openhotel/issues/451) ([#452](https://github.com/openhotel/openhotel/issues/452))


<a name="v0.5.2"></a>

## [v0.5.2](https://github.com/openhotel/openhotel/compare/v0.5.1...v0.5.2) (2024-12-12)

### Features

- implement teleports command + improvements and fixes - fix [#431](https://github.com/openhotel/openhotel/issues/431) ([#449](https://github.com/openhotel/openhotel/issues/449))
- add rooms as migrations + room info - fix [#447](https://github.com/openhotel/openhotel/issues/447) ([#448](https://github.com/openhotel/openhotel/issues/448))


<a name="v0.5.1"></a>

## [v0.5.1](https://github.com/openhotel/openhotel/compare/v0.5.0...v0.5.1) (2024-12-06)

### Features

- removed redirectUrl from config - fix [#443](https://github.com/openhotel/openhotel/issues/443) ([#444](https://github.com/openhotel/openhotel/issues/444))


<a name="v0.5.0"></a>

## [v0.5.0](https://github.com/openhotel/openhotel/compare/v0.4.4...v0.5.0) (2024-12-06)

### Features

- added multi-license - fix [#441](https://github.com/openhotel/openhotel/issues/441) ([#442](https://github.com/openhotel/openhotel/issues/442))
- added collaborators from all the public repos from openhotel - fix [#437](https://github.com/openhotel/openhotel/issues/437) ([#438](https://github.com/openhotel/openhotel/issues/438))
- implemented migrations - fix [#46](https://github.com/openhotel/openhotel/issues/46) ([#436](https://github.com/openhotel/openhotel/issues/436))
- save own chat messages on localstorage - fix [#426](https://github.com/openhotel/openhotel/issues/426) ([#428](https://github.com/openhotel/openhotel/issues/428))


<a name="v0.4.4"></a>

## [v0.4.4](https://github.com/openhotel/openhotel/compare/v0.4.3...v0.4.4) (2024-11-27)

### Bug Fixes

- coordinates not working on invalid ips or development - fix [#422](https://github.com/openhotel/openhotel/issues/422) ([#423](https://github.com/openhotel/openhotel/issues/423))

### Features

- room data db consistency + flags correctly positioned - fix [#425](https://github.com/openhotel/openhotel/issues/425) ([#427](https://github.com/openhotel/openhotel/issues/427))
- add reload and responsive disconnected screen - fix [#419](https://github.com/openhotel/openhotel/issues/419) ([#424](https://github.com/openhotel/openhotel/issues/424))


<a name="v0.4.3"></a>

## [v0.4.3](https://github.com/openhotel/openhotel/compare/v0.4.3-rc.3...v0.4.3) (2024-11-26)

### Bug Fixes

- incorrect hemisphere - fix [#420](https://github.com/openhotel/openhotel/issues/420) ([#421](https://github.com/openhotel/openhotel/issues/421))


<a name="v0.4.3-rc.3"></a>

## [v0.4.3-rc.3](https://github.com/openhotel/openhotel/compare/v0.4.3-rc.2...v0.4.3-rc.3) (2024-11-26)

### Bug Fixes

- incorrect hemisphere - fix [#420](https://github.com/openhotel/openhotel/issues/420)


<a name="v0.4.3-rc.2"></a>

## [v0.4.3-rc.2](https://github.com/openhotel/openhotel/compare/v0.4.3-rc.1...v0.4.3-rc.2) (2024-11-26)


<a name="v0.4.3-rc.1"></a>

## [v0.4.3-rc.1](https://github.com/openhotel/openhotel/compare/v0.4.2...v0.4.3-rc.1) (2024-11-26)


<a name="v0.4.2"></a>

## [v0.4.2](https://github.com/openhotel/openhotel/compare/v0.4.1...v0.4.2) (2024-11-26)

### Features

- added home v1 hotel - fix [#417](https://github.com/openhotel/openhotel/issues/417) ([#418](https://github.com/openhotel/openhotel/issues/418))


<a name="v0.4.1"></a>

## [v0.4.1](https://github.com/openhotel/openhotel/compare/v0.4.0...v0.4.1) (2024-11-26)

### Bug Fixes

- bubble messages are not aligned with human - fix [#281](https://github.com/openhotel/openhotel/issues/281) ([#412](https://github.com/openhotel/openhotel/issues/412))
- move ip call info to server - fix [#414](https://github.com/openhotel/openhotel/issues/414) ([#415](https://github.com/openhotel/openhotel/issues/415))


<a name="v0.4.0"></a>

## [v0.4.0](https://github.com/openhotel/openhotel/compare/v0.3.15...v0.4.0) (2024-11-26)

### Bug Fixes

- users file overwriting during server startup - fix [#410](https://github.com/openhotel/openhotel/issues/410) ([#411](https://github.com/openhotel/openhotel/issues/411))

### Features

- v3 auth rework - fix [#394](https://github.com/openhotel/openhotel/issues/394) ([#413](https://github.com/openhotel/openhotel/issues/413))


<a name="v0.3.15"></a>

## [v0.3.15](https://github.com/openhotel/openhotel/compare/v0.3.14...v0.3.15) (2024-11-23)

### Bug Fixes

- api token not available when connecting - fix [#408](https://github.com/openhotel/openhotel/issues/408) ([#409](https://github.com/openhotel/openhotel/issues/409))
- users file is not available first time - fix [#406](https://github.com/openhotel/openhotel/issues/406) ([#407](https://github.com/openhotel/openhotel/issues/407))


<a name="v0.3.14"></a>

## [v0.3.14](https://github.com/openhotel/openhotel/compare/v0.3.13...v0.3.14) (2024-11-23)

### Bug Fixes

- loading black screen - fix [#404](https://github.com/openhotel/openhotel/issues/404) ([#405](https://github.com/openhotel/openhotel/issues/405))
- improve first time as a developer - fix [#400](https://github.com/openhotel/openhotel/issues/400) ([#401](https://github.com/openhotel/openhotel/issues/401))

### Features

- extract all the contributors from the repos and include the nicks inside the build - fix [#393](https://github.com/openhotel/openhotel/issues/393) ([#402](https://github.com/openhotel/openhotel/issues/402))


<a name="v0.3.13"></a>

## [v0.3.13](https://github.com/openhotel/openhotel/compare/v0.3.12...v0.3.13) (2024-11-18)

### Bug Fixes

- version instead of development - fix [#397](https://github.com/openhotel/openhotel/issues/397)


<a name="v0.3.12"></a>

## [v0.3.12](https://github.com/openhotel/openhotel/compare/v0.3.11...v0.3.12) (2024-11-18)

### Features

- add spanish, european and more popular pride flags - fix [#395](https://github.com/openhotel/openhotel/issues/395) ([#396](https://github.com/openhotel/openhotel/issues/396))


<a name="v0.3.11"></a>

## [v0.3.11](https://github.com/openhotel/openhotel/compare/v0.3.10...v0.3.11) (2024-11-08)

### Bug Fixes

- auth disabled config is ignored on client - fix [#390](https://github.com/openhotel/openhotel/issues/390) ([#391](https://github.com/openhotel/openhotel/issues/391))


<a name="v0.3.10"></a>

## [v0.3.10](https://github.com/openhotel/openhotel/compare/v0.3.9...v0.3.10) (2024-11-08)

### Bug Fixes

- prevent zip library to use web workers - fix [#384](https://github.com/openhotel/openhotel/issues/384) ([#385](https://github.com/openhotel/openhotel/issues/385))

### Features

- bump utils to implement decompress - fix [#388](https://github.com/openhotel/openhotel/issues/388) ([#389](https://github.com/openhotel/openhotel/issues/389))
- bump utils - fix [#386](https://github.com/openhotel/openhotel/issues/386) ([#387](https://github.com/openhotel/openhotel/issues/387))


<a name="v0.3.9"></a>

## [v0.3.9](https://github.com/openhotel/openhotel/compare/v0.3.8...v0.3.9) (2024-11-03)

### Bug Fixes

- zip library dependency change - fix [#381](https://github.com/openhotel/openhotel/issues/381) ([#383](https://github.com/openhotel/openhotel/issues/383))
- catalog file not available first time - fix [#379](https://github.com/openhotel/openhotel/issues/379) ([#382](https://github.com/openhotel/openhotel/issues/382))

### Features

- be able to work on development environment with onet - fix [#31](https://github.com/openhotel/openhotel/issues/31) ([#380](https://github.com/openhotel/openhotel/issues/380))


<a name="v0.3.8"></a>

## [v0.3.8](https://github.com/openhotel/openhotel/compare/v0.3.7...v0.3.8) (2024-10-23)


<a name="v0.3.7"></a>

## [v0.3.7](https://github.com/openhotel/openhotel/compare/v0.3.6...v0.3.7) (2024-10-23)

### Features

- add log request ip - fix [#373](https://github.com/openhotel/openhotel/issues/373) ([#375](https://github.com/openhotel/openhotel/issues/375))


<a name="v0.3.6"></a>

## [v0.3.6](https://github.com/openhotel/openhotel/compare/v0.3.5...v0.3.6) (2024-10-23)

### Features

- add log request ip - fix [#373](https://github.com/openhotel/openhotel/issues/373) ([#374](https://github.com/openhotel/openhotel/issues/374))


<a name="v0.3.5"></a>

## [v0.3.5](https://github.com/openhotel/openhotel/compare/v0.3.4...v0.3.5) (2024-10-21)

### Features

- changed lat to hem north/south - fix [#366](https://github.com/openhotel/openhotel/issues/366) ([#367](https://github.com/openhotel/openhotel/issues/367))
- added latitude getter - fix [#364](https://github.com/openhotel/openhotel/issues/364) ([#365](https://github.com/openhotel/openhotel/issues/365))


<a name="v0.3.4"></a>

## [v0.3.4](https://github.com/openhotel/openhotel/compare/v0.3.3...v0.3.4) (2024-10-12)

### Bug Fixes

- add logs to onet - fix [#360](https://github.com/openhotel/openhotel/issues/360) ([#361](https://github.com/openhotel/openhotel/issues/361))


<a name="v0.3.3"></a>

## [v0.3.3](https://github.com/openhotel/openhotel/compare/v0.3.2...v0.3.3) (2024-10-11)

### Features

- connect to onet - fix [#358](https://github.com/openhotel/openhotel/issues/358) ([#359](https://github.com/openhotel/openhotel/issues/359))
- extract remote address on proxy - fix [#356](https://github.com/openhotel/openhotel/issues/356) ([#357](https://github.com/openhotel/openhotel/issues/357))


<a name="v0.3.2"></a>

## [v0.3.2](https://github.com/openhotel/openhotel/compare/v0.3.1...v0.3.2) (2024-10-09)

### Bug Fixes

- rooms loading first time - fix [#353](https://github.com/openhotel/openhotel/issues/353) ([#355](https://github.com/openhotel/openhotel/issues/355))


<a name="v0.3.1"></a>

## [v0.3.1](https://github.com/openhotel/openhotel/compare/v0.3.0...v0.3.1) (2024-10-09)

### Bug Fixes

- server auth only on prod + rooms loading first time - fix [#353](https://github.com/openhotel/openhotel/issues/353) ([#354](https://github.com/openhotel/openhotel/issues/354))


<a name="v0.3.0"></a>

## [v0.3.0](https://github.com/openhotel/openhotel/compare/v0.2.27...v0.3.0) (2024-10-09)

### Features

- add auth register on servers - fix [#349](https://github.com/openhotel/openhotel/issues/349) ([#350](https://github.com/openhotel/openhotel/issues/350))


<a name="v0.2.27"></a>

## [v0.2.27](https://github.com/openhotel/openhotel/compare/v0.2.26...v0.2.27) (2024-10-07)

### Bug Fixes

- proxy worker crashing - fix [#336](https://github.com/openhotel/openhotel/issues/336) ([#346](https://github.com/openhotel/openhotel/issues/346))

### Features

- implement utils library - fix [#347](https://github.com/openhotel/openhotel/issues/347) ([#348](https://github.com/openhotel/openhotel/issues/348))
- add oh/db library - fix [#344](https://github.com/openhotel/openhotel/issues/344) ([#345](https://github.com/openhotel/openhotel/issues/345))
- move server to system - fix [#342](https://github.com/openhotel/openhotel/issues/342) ([#343](https://github.com/openhotel/openhotel/issues/343))
- added [@oh](https://github.com/oh)/config - fix [#340](https://github.com/openhotel/openhotel/issues/340) ([#341](https://github.com/openhotel/openhotel/issues/341))


<a name="v0.2.26"></a>

## [v0.2.26](https://github.com/openhotel/openhotel/compare/v0.2.25...v0.2.26) (2024-10-02)


<a name="v0.2.25"></a>

## [v0.2.25](https://github.com/openhotel/openhotel/compare/v0.2.24...v0.2.25) (2024-10-02)


<a name="v0.2.24"></a>

## [v0.2.24](https://github.com/openhotel/openhotel/compare/v0.2.24.b...v0.2.24) (2024-10-02)


<a name="v0.2.24.b"></a>

## [v0.2.24.b](https://github.com/openhotel/openhotel/compare/v0.2.23...v0.2.24.b) (2024-10-02)

### Features

- added [@oh](https://github.com/oh)/updater - fix [#334](https://github.com/openhotel/openhotel/issues/334) ([#335](https://github.com/openhotel/openhotel/issues/335))


<a name="v0.2.23"></a>

## [v0.2.23](https://github.com/openhotel/openhotel/compare/v0.2.22...v0.2.23) (2024-10-01)

### Features

- added navigator redesign - fix [#302](https://github.com/openhotel/openhotel/issues/302) ([#333](https://github.com/openhotel/openhotel/issues/333))


<a name="v0.2.22"></a>

## [v0.2.22](https://github.com/openhotel/openhotel/compare/v0.2.21...v0.2.22) (2024-09-30)

### Features

- added ping check & user disconnected event config - fix [#330](https://github.com/openhotel/openhotel/issues/330) & fix [#331](https://github.com/openhotel/openhotel/issues/331) ([#332](https://github.com/openhotel/openhotel/issues/332))


<a name="v0.2.21"></a>

## [v0.2.21](https://github.com/openhotel/openhotel/compare/v0.2.20...v0.2.21) (2024-09-30)

### Bug Fixes

- user disconnected wrong auth ip url - fix [#328](https://github.com/openhotel/openhotel/issues/328) ([#329](https://github.com/openhotel/openhotel/issues/329))

### Features

- prevent going back + ping only on prod + bump tulip - fix [#326](https://github.com/openhotel/openhotel/issues/326) ([#327](https://github.com/openhotel/openhotel/issues/327))


<a name="v0.2.20"></a>

## [v0.2.20](https://github.com/openhotel/openhotel/compare/v0.2.20-rc.7...v0.2.20) (2024-09-29)

### Bug Fixes

- setInterval to ping auth service - fix [#323](https://github.com/openhotel/openhotel/issues/323)


<a name="v0.2.20-rc.7"></a>

## [v0.2.20-rc.7](https://github.com/openhotel/openhotel/compare/v0.2.20-rc.6...v0.2.20-rc.7) (2024-09-29)


<a name="v0.2.20-rc.6"></a>

## [v0.2.20-rc.6](https://github.com/openhotel/openhotel/compare/v0.2.20-rc.5...v0.2.20-rc.6) (2024-09-29)


<a name="v0.2.20-rc.5"></a>

## [v0.2.20-rc.5](https://github.com/openhotel/openhotel/compare/v0.2.20-rc.4...v0.2.20-rc.5) (2024-09-29)


<a name="v0.2.20-rc.4"></a>

## [v0.2.20-rc.4](https://github.com/openhotel/openhotel/compare/v0.2.20-rc.3...v0.2.20-rc.4) (2024-09-29)


<a name="v0.2.20-rc.3"></a>

## [v0.2.20-rc.3](https://github.com/openhotel/openhotel/compare/v0.2.20-rc.2...v0.2.20-rc.3) (2024-09-29)


<a name="v0.2.20-rc.2"></a>

## [v0.2.20-rc.2](https://github.com/openhotel/openhotel/compare/v0.2.20-rc.1...v0.2.20-rc.2) (2024-09-29)


<a name="v0.2.20-rc.1"></a>

## [v0.2.20-rc.1](https://github.com/openhotel/openhotel/compare/v0.2.19...v0.2.20-rc.1) (2024-09-29)


<a name="v0.2.19"></a>

## [v0.2.19](https://github.com/openhotel/openhotel/compare/v0.2.18...v0.2.19) (2024-09-29)


<a name="v0.2.18"></a>

## [v0.2.18](https://github.com/openhotel/openhotel/compare/v0.2.17...v0.2.18) (2024-09-29)

### Bug Fixes

- ip is local when user is disconnected - fix [#317](https://github.com/openhotel/openhotel/issues/317)  ([#322](https://github.com/openhotel/openhotel/issues/322))


<a name="v0.2.17"></a>

## [v0.2.17](https://github.com/openhotel/openhotel/compare/v0.2.16...v0.2.17) (2024-09-29)

### Bug Fixes

- ip is local when user is disconnected - fix [#317](https://github.com/openhotel/openhotel/issues/317)  ([#321](https://github.com/openhotel/openhotel/issues/321))


<a name="v0.2.16"></a>

## [v0.2.16](https://github.com/openhotel/openhotel/compare/v0.2.15...v0.2.16) (2024-09-29)

### Bug Fixes

- ip is local when user is disconnected - fix [#317](https://github.com/openhotel/openhotel/issues/317)  ([#320](https://github.com/openhotel/openhotel/issues/320))


<a name="v0.2.15"></a>

## [v0.2.15](https://github.com/openhotel/openhotel/compare/v0.2.14...v0.2.15) (2024-09-29)

### Bug Fixes

- ip is local when user is disconnected - fix [#317](https://github.com/openhotel/openhotel/issues/317)  ([#319](https://github.com/openhotel/openhotel/issues/319))


<a name="v0.2.14"></a>

## [v0.2.14](https://github.com/openhotel/openhotel/compare/v0.2.13...v0.2.14) (2024-09-29)

### Bug Fixes

- ip is local when user is disconnected - fix [#317](https://github.com/openhotel/openhotel/issues/317)  ([#318](https://github.com/openhotel/openhotel/issues/318))


<a name="v0.2.13"></a>

## [v0.2.13](https://github.com/openhotel/openhotel/compare/v0.2.12...v0.2.13) (2024-09-29)

### Bug Fixes

- user disconnected and interval on connect - fix [#314](https://github.com/openhotel/openhotel/issues/314) ([#316](https://github.com/openhotel/openhotel/issues/316))


<a name="v0.2.12"></a>

## [v0.2.12](https://github.com/openhotel/openhotel/compare/v0.2.11...v0.2.12) (2024-09-29)

### Bug Fixes

- user disconnected and interval on connect - fix [#314](https://github.com/openhotel/openhotel/issues/314) ([#315](https://github.com/openhotel/openhotel/issues/315))


<a name="v0.2.11"></a>

## [v0.2.11](https://github.com/openhotel/openhotel/compare/v0.2.10...v0.2.11) (2024-09-29)

### Bug Fixes

- experiment - fix [#310](https://github.com/openhotel/openhotel/issues/310) ([#313](https://github.com/openhotel/openhotel/issues/313))


<a name="v0.2.10"></a>

## [v0.2.10](https://github.com/openhotel/openhotel/compare/v0.2.9...v0.2.10) (2024-09-29)

### Bug Fixes

- experiment - fix [#310](https://github.com/openhotel/openhotel/issues/310) ([#312](https://github.com/openhotel/openhotel/issues/312))


<a name="v0.2.9"></a>

## [v0.2.9](https://github.com/openhotel/openhotel/compare/v0.2.8...v0.2.9) (2024-09-29)

### Bug Fixes

- experiment - fix [#310](https://github.com/openhotel/openhotel/issues/310) ([#311](https://github.com/openhotel/openhotel/issues/311))


<a name="v0.2.8"></a>

## [v0.2.8](https://github.com/openhotel/openhotel/compare/v0.2.7...v0.2.8) (2024-09-29)

### Features

- updated OHAP with ping disconnections - fix [#308](https://github.com/openhotel/openhotel/issues/308) ([#309](https://github.com/openhotel/openhotel/issues/309))


<a name="v0.2.7"></a>

## [v0.2.7](https://github.com/openhotel/openhotel/compare/v0.2.6...v0.2.7) (2024-09-26)

### Bug Fixes

- fixed config on client being undefined - fix [#306](https://github.com/openhotel/openhotel/issues/306) ([#307](https://github.com/openhotel/openhotel/issues/307))


<a name="v0.2.6"></a>

## [v0.2.6](https://github.com/openhotel/openhotel/compare/v0.2.5...v0.2.6) (2024-09-26)

### Features

- add config title and description - fix [#304](https://github.com/openhotel/openhotel/issues/304) ([#305](https://github.com/openhotel/openhotel/issues/305))


<a name="v0.2.5"></a>

## [v0.2.5](https://github.com/openhotel/openhotel/compare/v0.2.4...v0.2.5) (2024-09-25)

### Bug Fixes

- remove human from room when disconnected - fix [#297](https://github.com/openhotel/openhotel/issues/297) ([#300](https://github.com/openhotel/openhotel/issues/300))


<a name="v0.2.4"></a>

## [v0.2.4](https://github.com/openhotel/openhotel/compare/v0.2.3...v0.2.4) (2024-09-24)

### Features

- added hot-bar icon list + updated libraries - fix [#298](https://github.com/openhotel/openhotel/issues/298) ([#299](https://github.com/openhotel/openhotel/issues/299))


<a name="v0.2.3"></a>

## [v0.2.3](https://github.com/openhotel/openhotel/compare/v0.2.2...v0.2.3) (2024-09-21)

### Bug Fixes

- cursor pointer inside private rooms modal - fix [#287](https://github.com/openhotel/openhotel/issues/287) ([#288](https://github.com/openhotel/openhotel/issues/288))

### Features

- add cursor coords to top left - fix [#292](https://github.com/openhotel/openhotel/issues/292) ([#295](https://github.com/openhotel/openhotel/issues/295))
- move human to exit if pf is available - fix [#278](https://github.com/openhotel/openhotel/issues/278) ([#293](https://github.com/openhotel/openhotel/issues/293))


<a name="v0.2.2"></a>

## [v0.2.2](https://github.com/openhotel/openhotel/compare/v0.2.1...v0.2.2) (2024-09-13)

### Bug Fixes

- proxy development path - fix [#285](https://github.com/openhotel/openhotel/issues/285) ([#286](https://github.com/openhotel/openhotel/issues/286))


<a name="v0.2.1"></a>

## [v0.2.1](https://github.com/openhotel/openhotel/compare/v0.2.0...v0.2.1) (2024-09-13)

### Features

- added basic room list modal - fix [#275](https://github.com/openhotel/openhotel/issues/275) ([#284](https://github.com/openhotel/openhotel/issues/284))


<a name="v0.2.0"></a>

## [v0.2.0](https://github.com/openhotel/openhotel/compare/v0.1.6...v0.2.0) (2024-09-13)

### Features

- added basic room list modal - fix [#275](https://github.com/openhotel/openhotel/issues/275) ([#282](https://github.com/openhotel/openhotel/issues/282))


<a name="v0.1.6"></a>

## [v0.1.6](https://github.com/openhotel/openhotel/compare/v0.1.5...v0.1.6) (2024-08-27)

### Features

- Center private rooms to screen - fix [#74](https://github.com/openhotel/openhotel/issues/74) ([#276](https://github.com/openhotel/openhotel/issues/276))


<a name="v0.1.5"></a>

## [v0.1.5](https://github.com/openhotel/openhotel/compare/v0.1.5-rc.2...v0.1.5) (2024-08-22)

### Features

- Move proxy to default path and removed extra ports ([#273](https://github.com/openhotel/openhotel/issues/273))


<a name="v0.1.5-rc.2"></a>

## [v0.1.5-rc.2](https://github.com/openhotel/openhotel/compare/v0.1.5-rc.1...v0.1.5-rc.2) (2024-08-22)

### Features

- Move proxy to default path and removed extra ports


<a name="v0.1.5-rc.1"></a>

## [v0.1.5-rc.1](https://github.com/openhotel/openhotel/compare/v0.1.4...v0.1.5-rc.1) (2024-08-22)

### Features

- Move proxy to default path and removed extra ports


<a name="v0.1.4"></a>

## [v0.1.4](https://github.com/openhotel/openhotel/compare/v0.1.2...v0.1.4) (2024-08-16)

### Features

- Changed default config auth urls to openhotel ones - fix [#269](https://github.com/openhotel/openhotel/issues/269) ([#270](https://github.com/openhotel/openhotel/issues/270))


<a name="v0.1.2"></a>

## [v0.1.2](https://github.com/openhotel/openhotel/compare/v0.1.3...v0.1.2) (2024-08-16)


<a name="v0.1.3"></a>

## [v0.1.3](https://github.com/openhotel/openhotel/compare/v0.1.1...v0.1.3) (2024-08-16)

### Bug Fixes

- RedirectURL config is misspelled - fix [#267](https://github.com/openhotel/openhotel/issues/267) ([#268](https://github.com/openhotel/openhotel/issues/268))


<a name="v0.1.1"></a>

## [v0.1.1](https://github.com/openhotel/openhotel/compare/v0.1.0...v0.1.1) (2024-08-16)


<a name="v0.1.0"></a>

## [v0.1.0](https://github.com/openhotel/openhotel/compare/v0.1.0-rc.1...v0.1.0) (2024-08-16)

### Features

- added OHAP (OpenHotel Auth Protocol) - fix [#169](https://github.com/openhotel/openhotel/issues/169) ([#265](https://github.com/openhotel/openhotel/issues/265))


<a name="v0.1.0-rc.1"></a>

## [v0.1.0-rc.1](https://github.com/openhotel/openhotel/compare/v0.0.50...v0.1.0-rc.1) (2024-08-16)

### Features

- added OHAP (OpenHotel Auth Protocol) - fix [#169](https://github.com/openhotel/openhotel/issues/169)
- added OHAP (OpenHotel Auth Protocol) - fix [#169](https://github.com/openhotel/openhotel/issues/169)
- add unset command - fix [#222](https://github.com/openhotel/openhotel/issues/222) ([#264](https://github.com/openhotel/openhotel/issues/264))


<a name="v0.0.50"></a>

## [v0.0.50](https://github.com/openhotel/openhotel/compare/v0.0.49...v0.0.50) (2024-08-13)

### Features

- add database and save furniture rooms - fix [#225](https://github.com/openhotel/openhotel/issues/225) ([#263](https://github.com/openhotel/openhotel/issues/263))


<a name="v0.0.49"></a>

## [v0.0.49](https://github.com/openhotel/openhotel/compare/v0.0.48...v0.0.49) (2024-08-12)

### Features

- add initial loader - fix [#260](https://github.com/openhotel/openhotel/issues/260) ([#262](https://github.com/openhotel/openhotel/issues/262))


<a name="v0.0.48"></a>

## [v0.0.48](https://github.com/openhotel/openhotel/compare/v0.0.47...v0.0.48) (2024-08-12)

### Bug Fixes

- Fixed selector on stairs - fix [#244](https://github.com/openhotel/openhotel/issues/244) ([#250](https://github.com/openhotel/openhotel/issues/250))

### Features

- add locales on server - fix [#253](https://github.com/openhotel/openhotel/issues/253) ([#259](https://github.com/openhotel/openhotel/issues/259))
- add help command - fix [#254](https://github.com/openhotel/openhotel/issues/254) ([#258](https://github.com/openhotel/openhotel/issues/258))
- add check version when op enter & fix load furnitures - fix [#234](https://github.com/openhotel/openhotel/issues/234) & fix [#257](https://github.com/openhotel/openhotel/issues/257) ([#256](https://github.com/openhotel/openhotel/issues/256))
- added furniture miniatures + added zip furniture - fix [#251](https://github.com/openhotel/openhotel/issues/251) fix [#252](https://github.com/openhotel/openhotel/issues/252) ([#255](https://github.com/openhotel/openhotel/issues/255))


<a name="v0.0.47"></a>

## [v0.0.47](https://github.com/openhotel/openhotel/compare/v0.0.47-alpha.1...v0.0.47) (2024-08-10)

### Features

- Moved furniture data to server and fixed bug with render non valid furniture - fix [#244](https://github.com/openhotel/openhotel/issues/244) ([#249](https://github.com/openhotel/openhotel/issues/249))


<a name="v0.0.47-alpha.1"></a>

## [v0.0.47-alpha.1](https://github.com/openhotel/openhotel/compare/v0.0.46...v0.0.47-alpha.1) (2024-08-10)

### Bug Fixes

- human bubble - fix [#241](https://github.com/openhotel/openhotel/issues/241) ([#247](https://github.com/openhotel/openhotel/issues/247))
- disable autosend messages - fix [#242](https://github.com/openhotel/openhotel/issues/242) ([#246](https://github.com/openhotel/openhotel/issues/246))

### Features

- Moved furniture data to server and fixed bug with render non valid furniture - fix [#244](https://github.com/openhotel/openhotel/issues/244)
- Moved furniture data to server and fixed bug with render non valid furniture - fix [#244](https://github.com/openhotel/openhotel/issues/244)


<a name="v0.0.46"></a>

## [v0.0.46](https://github.com/openhotel/openhotel/compare/v0.0.45...v0.0.46) (2024-08-10)

### Bug Fixes

- fixed spawn tile missing - fix [#230](https://github.com/openhotel/openhotel/issues/230) ([#236](https://github.com/openhotel/openhotel/issues/236))

### Features

- calc human direction on spawn + save player direction + context on menus - fix [#235](https://github.com/openhotel/openhotel/issues/235) fix [#237](https://github.com/openhotel/openhotel/issues/237) ([#240](https://github.com/openhotel/openhotel/issues/240))


<a name="v0.0.45"></a>

## [v0.0.45](https://github.com/openhotel/openhotel/compare/v0.0.44...v0.0.45) (2024-08-09)

### Bug Fixes

- moved Y calc to server - fix [#220](https://github.com/openhotel/openhotel/issues/220) ([#228](https://github.com/openhotel/openhotel/issues/228))
- added defaults + fixed filter frame furniture from pf - fix [#221](https://github.com/openhotel/openhotel/issues/221) ([#224](https://github.com/openhotel/openhotel/issues/224))

### Features

- render player directions without arms - fix [#32](https://github.com/openhotel/openhotel/issues/32) ([#231](https://github.com/openhotel/openhotel/issues/231))


<a name="v0.0.44"></a>

## [v0.0.44](https://github.com/openhotel/openhotel/compare/v0.0.43...v0.0.44) (2024-08-07)

### Bug Fixes

- chat historial only with focus - fix [#213](https://github.com/openhotel/openhotel/issues/213) ([#218](https://github.com/openhotel/openhotel/issues/218))

### Features

- added frames - fix [#217](https://github.com/openhotel/openhotel/issues/217) ([#219](https://github.com/openhotel/openhotel/issues/219))


<a name="v0.0.43"></a>

## [v0.0.43](https://github.com/openhotel/openhotel/compare/v0.0.42...v0.0.43) (2024-08-05)

### Bug Fixes

- Server assets not bundled - fix [#215](https://github.com/openhotel/openhotel/issues/215) ([#216](https://github.com/openhotel/openhotel/issues/216))


<a name="v0.0.42"></a>

## [v0.0.42](https://github.com/openhotel/openhotel/compare/v0.0.41...v0.0.42) (2024-08-05)

### Features

- added /set command + RAM furniture and first steps of catalog internals - fix [#203](https://github.com/openhotel/openhotel/issues/203) ([#214](https://github.com/openhotel/openhotel/issues/214))


<a name="v0.0.41"></a>

## [v0.0.41](https://github.com/openhotel/openhotel/compare/v0.0.40...v0.0.41) (2024-08-03)

### Bug Fixes

- fixed stairs height - fix [#200](https://github.com/openhotel/openhotel/issues/200) ([#204](https://github.com/openhotel/openhotel/issues/204))
- Prevent proxy crashing - fix [#201](https://github.com/openhotel/openhotel/issues/201) ([#202](https://github.com/openhotel/openhotel/issues/202))
- Preventing getting an invalid position from layout - fix [#198](https://github.com/openhotel/openhotel/issues/198) ([#199](https://github.com/openhotel/openhotel/issues/199))

### Features

- add accents - fix [#209](https://github.com/openhotel/openhotel/issues/209) ([#210](https://github.com/openhotel/openhotel/issues/210))
- support multi languages - fix [#79](https://github.com/openhotel/openhotel/issues/79) ([#208](https://github.com/openhotel/openhotel/issues/208))
- support multi languages - fix [#79](https://github.com/openhotel/openhotel/issues/79) ([#207](https://github.com/openhotel/openhotel/issues/207))
- Add /tp command - fix [#205](https://github.com/openhotel/openhotel/issues/205) ([#206](https://github.com/openhotel/openhotel/issues/206))


<a name="v0.0.40"></a>

## [v0.0.40](https://github.com/openhotel/openhotel/compare/v0.0.39...v0.0.40) (2024-08-01)

### Features

- add loader component - fix [#131](https://github.com/openhotel/openhotel/issues/131) ([#196](https://github.com/openhotel/openhotel/issues/196))


<a name="v0.0.39"></a>

## [v0.0.39](https://github.com/openhotel/openhotel/compare/v0.0.38...v0.0.39) (2024-08-01)

### Features

- Improvements on pathfinding velocity - fix [#189](https://github.com/openhotel/openhotel/issues/189) ([#194](https://github.com/openhotel/openhotel/issues/194))
- Fix sprites and sprite-sheets loading and bump tulip - fix [#191](https://github.com/openhotel/openhotel/issues/191) ([#193](https://github.com/openhotel/openhotel/issues/193))
- add bold font - fix [#72](https://github.com/openhotel/openhotel/issues/72) ([#192](https://github.com/openhotel/openhotel/issues/192))
- add player/furniture preview - fix [#88](https://github.com/openhotel/openhotel/issues/88) ([#190](https://github.com/openhotel/openhotel/issues/190))
- Allow blocked diagonals on pathfinding - fix [#187](https://github.com/openhotel/openhotel/issues/187) ([#188](https://github.com/openhotel/openhotel/issues/188))


<a name="v0.0.38"></a>

## [v0.0.38](https://github.com/openhotel/openhotel/compare/v0.0.37...v0.0.38) (2024-07-31)


<a name="v0.0.37"></a>

## [v0.0.37](https://github.com/openhotel/openhotel/compare/v0.0.36...v0.0.37) (2024-07-31)

### Bug Fixes

- save username on localstorage - fix [#166](https://github.com/openhotel/openhotel/issues/166) ([#182](https://github.com/openhotel/openhotel/issues/182))
- not show typing bubble on commands - fix [#173](https://github.com/openhotel/openhotel/issues/173) ([#181](https://github.com/openhotel/openhotel/issues/181))
- Block last message if equals to current one - fix [#176](https://github.com/openhotel/openhotel/issues/176) ([#180](https://github.com/openhotel/openhotel/issues/180))
- Spawn traveler - fix [#177](https://github.com/openhotel/openhotel/issues/177) ([#179](https://github.com/openhotel/openhotel/issues/179))

### Features

- Improved pathfinding + bumped tulip version + performance improvements - fix [#174](https://github.com/openhotel/openhotel/issues/174)  ([#184](https://github.com/openhotel/openhotel/issues/184))
- Added infinite writing chat - fix [#175](https://github.com/openhotel/openhotel/issues/175) ([#178](https://github.com/openhotel/openhotel/issues/178))


<a name="v0.0.36"></a>

## [v0.0.36](https://github.com/openhotel/openhotel/compare/v0.0.35...v0.0.36) (2024-07-30)

### Bug Fixes

- width character ñ - fix [#138](https://github.com/openhotel/openhotel/issues/138) ([#171](https://github.com/openhotel/openhotel/issues/171))

### Features

- Improved server user/room control + added queue on client and server - fix [#35](https://github.com/openhotel/openhotel/issues/35) ([#172](https://github.com/openhotel/openhotel/issues/172))
- add chat history - fix [#115](https://github.com/openhotel/openhotel/issues/115) ([#170](https://github.com/openhotel/openhotel/issues/170))
- added blacklist and whitelist commands ([#168](https://github.com/openhotel/openhotel/issues/168))


<a name="v0.0.35"></a>

## [v0.0.35](https://github.com/openhotel/openhotel/compare/v0.0.34...v0.0.35) (2024-07-28)

### Features

- added refresh token and reconnect if present - fix [#125](https://github.com/openhotel/openhotel/issues/125) ([#165](https://github.com/openhotel/openhotel/issues/165))


<a name="v0.0.34"></a>

## [v0.0.34](https://github.com/openhotel/openhotel/compare/v0.0.33...v0.0.34) (2024-07-27)


<a name="v0.0.33"></a>

## [v0.0.33](https://github.com/openhotel/openhotel/compare/v0.0.32...v0.0.33) (2024-07-27)


<a name="v0.0.32"></a>

## [v0.0.32](https://github.com/openhotel/openhotel/compare/v0.0.31...v0.0.32) (2024-07-27)


<a name="v0.0.31"></a>

## [v0.0.31](https://github.com/openhotel/openhotel/compare/v0.0.30...v0.0.31) (2024-07-27)


<a name="v0.0.30"></a>

## [v0.0.30](https://github.com/openhotel/openhotel/compare/v0.0.29...v0.0.30) (2024-07-26)


<a name="v0.0.29"></a>

## [v0.0.29](https://github.com/openhotel/openhotel/compare/v0.0.28...v0.0.29) (2024-07-26)


<a name="v0.0.28"></a>

## [v0.0.28](https://github.com/openhotel/openhotel/compare/v0.0.27...v0.0.28) (2024-07-26)


<a name="v0.0.27"></a>

## [v0.0.27](https://github.com/openhotel/openhotel/compare/v0.0.26...v0.0.27) (2024-07-25)


<a name="v0.0.26"></a>

## [v0.0.26](https://github.com/openhotel/openhotel/compare/v0.0.25...v0.0.26) (2024-07-25)


<a name="v0.0.25"></a>

## [v0.0.25](https://github.com/openhotel/openhotel/compare/v0.0.24...v0.0.25) (2024-07-25)


<a name="v0.0.24"></a>

## [v0.0.24](https://github.com/openhotel/openhotel/compare/v0.0.23...v0.0.24) (2024-07-24)


<a name="v0.0.23"></a>

## [v0.0.23](https://github.com/openhotel/openhotel/compare/v0.0.22...v0.0.23) (2024-07-24)


<a name="v0.0.22"></a>

## [v0.0.22](https://github.com/openhotel/openhotel/compare/v0.0.21...v0.0.22) (2024-07-23)


<a name="v0.0.21"></a>

## [v0.0.21](https://github.com/openhotel/openhotel/compare/v0.0.20...v0.0.21) (2024-07-22)


<a name="v0.0.20"></a>

## [v0.0.20](https://github.com/openhotel/openhotel/compare/v0.0.19...v0.0.20) (2024-07-21)


<a name="v0.0.19"></a>

## [v0.0.19](https://github.com/openhotel/openhotel/compare/v0.0.18...v0.0.19) (2024-07-21)


<a name="v0.0.18"></a>

## [v0.0.18](https://github.com/openhotel/openhotel/compare/v0.0.17...v0.0.18) (2024-07-21)


<a name="v0.0.17"></a>

## [v0.0.17](https://github.com/openhotel/openhotel/compare/v0.0.16...v0.0.17) (2024-07-20)


<a name="v0.0.16"></a>

## [v0.0.16](https://github.com/openhotel/openhotel/compare/v0.0.15...v0.0.16) (2024-07-18)


<a name="v0.0.15"></a>

## [v0.0.15](https://github.com/openhotel/openhotel/compare/v0.0.14...v0.0.15) (2024-07-17)


<a name="v0.0.14"></a>

## [v0.0.14](https://github.com/openhotel/openhotel/compare/v0.0.13...v0.0.14) (2024-07-14)


<a name="v0.0.13"></a>

## [v0.0.13](https://github.com/openhotel/openhotel/compare/v0.0.12...v0.0.13) (2024-07-14)


<a name="v0.0.12"></a>

## [v0.0.12](https://github.com/openhotel/openhotel/compare/v0.0.11...v0.0.12) (2024-07-14)


<a name="v0.0.11"></a>

## [v0.0.11](https://github.com/openhotel/openhotel/compare/v0.0.10...v0.0.11) (2024-07-11)


<a name="v0.0.10"></a>

## [v0.0.10](https://github.com/openhotel/openhotel/compare/v0.0.9...v0.0.10) (2024-07-09)


<a name="v0.0.9"></a>

## [v0.0.9](https://github.com/openhotel/openhotel/compare/v0.0.8...v0.0.9) (2024-07-09)


<a name="v0.0.8"></a>

## [v0.0.8](https://github.com/openhotel/openhotel/compare/v0.0.7...v0.0.8) (2024-07-05)


<a name="v0.0.7"></a>

## [v0.0.7](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.30...v0.0.7) (2024-07-03)


<a name="v0.0.7-alpha.30"></a>

## [v0.0.7-alpha.30](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.29...v0.0.7-alpha.30) (2024-07-03)


<a name="v0.0.7-alpha.29"></a>

## [v0.0.7-alpha.29](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.28...v0.0.7-alpha.29) (2024-07-03)


<a name="v0.0.7-alpha.28"></a>

## [v0.0.7-alpha.28](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.27...v0.0.7-alpha.28) (2024-07-03)


<a name="v0.0.7-alpha.27"></a>

## [v0.0.7-alpha.27](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.26...v0.0.7-alpha.27) (2024-07-03)


<a name="v0.0.7-alpha.26"></a>

## [v0.0.7-alpha.26](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.25...v0.0.7-alpha.26) (2024-07-03)


<a name="v0.0.7-alpha.25"></a>

## [v0.0.7-alpha.25](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.23...v0.0.7-alpha.25) (2024-07-03)


<a name="v0.0.7-alpha.23"></a>

## [v0.0.7-alpha.23](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.24...v0.0.7-alpha.23) (2024-07-03)


<a name="v0.0.7-alpha.24"></a>

## [v0.0.7-alpha.24](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.22...v0.0.7-alpha.24) (2024-07-03)


<a name="v0.0.7-alpha.22"></a>

## [v0.0.7-alpha.22](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.20...v0.0.7-alpha.22) (2024-07-03)


<a name="v0.0.7-alpha.20"></a>

## [v0.0.7-alpha.20](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.19...v0.0.7-alpha.20) (2024-07-03)


<a name="v0.0.7-alpha.19"></a>

## [v0.0.7-alpha.19](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.18...v0.0.7-alpha.19) (2024-07-03)


<a name="v0.0.7-alpha.18"></a>

## [v0.0.7-alpha.18](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.17...v0.0.7-alpha.18) (2024-07-01)


<a name="v0.0.7-alpha.17"></a>

## [v0.0.7-alpha.17](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.16...v0.0.7-alpha.17) (2024-07-01)


<a name="v0.0.7-alpha.16"></a>

## [v0.0.7-alpha.16](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.15...v0.0.7-alpha.16) (2024-07-01)


<a name="v0.0.7-alpha.15"></a>

## [v0.0.7-alpha.15](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.14...v0.0.7-alpha.15) (2024-07-01)


<a name="v0.0.7-alpha.14"></a>

## [v0.0.7-alpha.14](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.13...v0.0.7-alpha.14) (2024-07-01)


<a name="v0.0.7-alpha.13"></a>

## [v0.0.7-alpha.13](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.12...v0.0.7-alpha.13) (2024-07-01)


<a name="v0.0.7-alpha.12"></a>

## [v0.0.7-alpha.12](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.11...v0.0.7-alpha.12) (2024-07-01)


<a name="v0.0.7-alpha.11"></a>

## [v0.0.7-alpha.11](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.10...v0.0.7-alpha.11) (2024-07-01)


<a name="v0.0.7-alpha.10"></a>

## [v0.0.7-alpha.10](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.9...v0.0.7-alpha.10) (2024-07-01)


<a name="v0.0.7-alpha.9"></a>

## [v0.0.7-alpha.9](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.8...v0.0.7-alpha.9) (2024-07-01)


<a name="v0.0.7-alpha.8"></a>

## [v0.0.7-alpha.8](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.7...v0.0.7-alpha.8) (2024-07-01)


<a name="v0.0.7-alpha.7"></a>

## [v0.0.7-alpha.7](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.6...v0.0.7-alpha.7) (2024-07-01)


<a name="v0.0.7-alpha.6"></a>

## [v0.0.7-alpha.6](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.5...v0.0.7-alpha.6) (2024-07-01)


<a name="v0.0.7-alpha.5"></a>

## [v0.0.7-alpha.5](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.4...v0.0.7-alpha.5) (2024-07-01)


<a name="v0.0.7-alpha.4"></a>

## [v0.0.7-alpha.4](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.3...v0.0.7-alpha.4) (2024-07-01)


<a name="v0.0.7-alpha.3"></a>

## [v0.0.7-alpha.3](https://github.com/openhotel/openhotel/compare/v0.0.7.alpha.2...v0.0.7-alpha.3) (2024-07-01)


<a name="v0.0.7.alpha.2"></a>

## [v0.0.7.alpha.2](https://github.com/openhotel/openhotel/compare/v0.0.7.alpha.1...v0.0.7.alpha.2) (2024-07-01)


<a name="v0.0.7.alpha.1"></a>

## [v0.0.7.alpha.1](https://github.com/openhotel/openhotel/compare/v0.0.6...v0.0.7.alpha.1) (2024-07-01)


<a name="v0.0.6"></a>

## [v0.0.6](https://github.com/openhotel/openhotel/compare/v0.0.7-alpha.21...v0.0.6) (2024-06-30)


<a name="v0.0.7-alpha.21"></a>

## [v0.0.7-alpha.21](https://github.com/openhotel/openhotel/compare/v0.0.5...v0.0.7-alpha.21) (2024-06-30)


<a name="v0.0.5"></a>

## [v0.0.5](https://github.com/openhotel/openhotel/compare/v0.0.4...v0.0.5) (2024-06-30)


<a name="v0.0.4"></a>

## [v0.0.4](https://github.com/openhotel/openhotel/compare/v0.0.3...v0.0.4) (2024-06-30)


<a name="v0.0.3"></a>

## [v0.0.3](https://github.com/openhotel/openhotel/compare/v0.0.2...v0.0.3) (2024-06-30)


<a name="v0.0.2"></a>

## [v0.0.2](https://github.com/openhotel/openhotel/compare/v0.0.1...v0.0.2) (2024-06-29)


<a name="v0.0.1"></a>

## [v0.0.1](https://github.com/openhotel/openhotel/compare/v0.0.1-alpha.22...v0.0.1) (2024-06-29)


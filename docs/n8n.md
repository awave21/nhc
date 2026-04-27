# N8N

## Автоматизация

N8N — платформа автоматизации рабочих процессов. Связывает Telegram, Supabase и другие сервисы через визуальные сценарии (workflows).

### Обработка входящего сообщения

- Trigger: Telegram Webhook
- Workflow: [https://n8n.sarasvatiplace.online/workflow/ZpxQ7nvdLP88PQc1](https://n8n.sarasvatiplace.online/workflow/ZpxQ7nvdLP88PQc1)

Автоматизированный Telegram-бот «Виктория» — служба заботы Академии NHC. Обрабатывает входящие сообщения пользователей, определяет их контекст, отвечает через AI-агента и сохраняет историю диалогов.

#### Шаги

- Webhook принимает все входящие POST-события от Telegram.
- Switch ветвит поток на маршруты start, voice, channel (игнор) или text.
- Загружается контекст пользователя (HTTP get-info, кэш Redis ~23.5 ч, узел context).
- Текст дебаунсится через waiting_message; голос транскрибируется Whisper; запись в dialogs и вызов агента с инструментами.
- Ответ агента сохраняется в dialogs и отправляется пользователю по абзацам.

#### Подробности

### Точка входа

Webhook — единственная точка входа. Принимает все входящие POST-запросы от Telegram. Каждое событие (текст, голос, команда /start) попадает сюда.

### Маршрутизация (Switch)

Switch ветвит поток на четыре маршрута:

- start — команда /start, новый пользователь или перезапуск сессии
- voice — голосовое сообщение
- channel — сообщение из группового чата (игнорируется)
- text — обычное текстовое сообщение

### Маршрут /start — приветствие нового пользователя

Шаг 1: регистрация и подарок из Bothelp. После Switch → start параллельно выполняются Get many database pages и Get many database pages1 — поиск пользователя в Notion по username и telegram_id среди перешедших из Ботхелп; при нахождении — Send a text message2 с подарочным сообщением. Call «создание пользователя в notion и присвоение UTM» фоново регистрирует пользователя в Notion и присваивает UTM.

Шаг 2: загрузка контекста. Проверяем отправляет сообщение «Проверяем что мы уже знаем о вас...» с индикатором ожидания. HTTP Request запрашивает внешний сервис get-info по username и telegram_id (история проектов и платежей). Aggregate1 → Redis1 агрегируют и кэшируют данные на 23.5 часа. context1 форматирует имя, проекты со статусами и датами, платежи — текст для агента.

Шаг 3: приветствие. agent9 (GPT-4.1) — агент для /start: предстоящий ретрит — как участник и помощь с подготовкой; прошедший — впечатления и следующие программы; без данных — нейтральное приветствие. Память chat_histories3 (PostgreSQL, 8 последних сообщений). Send a text start1 редактирует сообщение «Проверяем...» на ответ агента.

### Маршрут text — обычное сообщение

Кэш и контекст: Redis — попытка взять данные по username; userdata → If1: при наличии кэша — context; иначе HTTP Request3 → Aggregate2 → Redis2 → context.

If проверяет /start в текущем сообщении: да — Delete a row очищает историю chat_histories в Supabase (сброс сессии); нет — voice проверяет тип. voice: текст → wait_message_create; голос → Get a file.

Дебаунсинг: wait_message_create пишет в waiting_message (Supabase) chat_id, message_id и текст. Wait2 — пауза. Select_message — последнее сообщение по chat_id. If5 сравнивает message_id с текущим: совпало — пользователь закончил набор; иначе инстанс завершается. get_message1 забирает накопленные сообщения, AggregaMessage объединяет тексты, Delete a row1 очищает waiting_message для chat_id.

Голос: Get a file скачивает аудио по file_id, message1 (Whisper) транскрибирует. Оба пути сходятся на create_message.

create_message сохраняет сообщение пользователя в dialogs с ролью user. Select rows dialogs — 7 последних записей по убыванию id. Aggregadialogs собирает историю { message, role }. message формирует объект с message, chat_id, context, name, tg_username.

Send a chat action2 — индикатор «печатает...». agent (GPT-5.2, температура 0.7) получает сообщение, историю, контекст пользователя и текущую дату. Инструменты: VECTOR (LightRAG), EVENT (projects в Supabase), tariffs, order, PAYMENT_LINK, escalation, user_profile, Think. Память chat_histories (8 сообщений).

create_agent_message сохраняет ответ в dialogs с ролью agent. Code in JavaScript2 режет ответ по пустым строкам на абзацы. Loop Over Items3: Replace Me1 → Insert or update rows в users; Send a text message — абзац в Telegram; Wait 1 с; Replace Me — цикл.

### Хранилища данных


| Хранилище                                  | Тип                   | Назначение                                                                                           |
| ------------------------------------------ | --------------------- | ---------------------------------------------------------------------------------------------------- |
| dialogs                                    | Supabase/PostgreSQL   | История сообщений (пользователь и агент)                                                             |
| lightrag                                   | PostgreSQL (Supabase) | Журнал синхронизации FAQ с LightRAG; наполняется workflow Notion → LightRAG                          |
| escalation_levels / unanswered_escalations | PostgreSQL (Supabase) | Пороги и учёт фоллоу-апов при молчании — отдельный schedule workflow                                 |
| chat_histories                             | PostgreSQL            | Контекстное окно для LangChain (8 сообщений)                                                         |
| waiting_message                            | Supabase              | Дебаунсинг входящего текста                                                                          |
| users                                      | PostgreSQL            | Профили пользователей (upsert при сообщении)                                                         |
| Redis                                      | In-memory cache       | Кэш данных пользователя (TTL ~23.5 ч)                                                                |
| Notion                                     | Внешняя БД            | Регистрация, UTM, Bothelp; база «База знаний ии бота» — источник FAQ для LightRAG (см. workflow RAG) |


### AI-модели


| Нода                | Модель     | Назначение                       |
| ------------------- | ---------- | -------------------------------- |
| OpenAI_Model        | GPT-5.2    | Основной агент «Виктория»        |
| OpenAI_Model_5_mimi | GPT-5-mini | Резервная модель агента          |
| OpenAI_Model2       | GPT-4.1    | Агент приветствия /start         |
| message1            | Whisper    | Транскрипция голосовых сообщений |


### Внешние вызовы (sub-workflows)


| Workflow                                        | Когда вызывается                                                                                                                        |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| VECTOR (LightRAG)                               | Из основного диалога — поиск по индексированным FAQ на сервисе [https://lightrag.nhc.live/webui/#/](https://lightrag.nhc.live/webui/#/) |
| escalation                                      | Строка в escalation_message → уведомление кураторам по расписанию                                                                       |
| Фоллоу-ап (отдельный workflow)                  | По расписанию — напоминание пользователю при молчании после ответа агента (не вызывается из основного webhook)                          |
| RAG Knowledge Base                              | Отдельный workflow — опрос Notion и загрузка FAQ в LightRAG; не вызывается из основного webhook                                         |
| PAYMENT_LINK                                    | Готовность к оплате: сценарий QR/ссылки (Init + GetQr), заявка в event_registrations                                                    |
| order                                           | Заявки — создание строки в event_registrations                                                                                          |
| tariffs                                         | Тарифы по событию                                                                                                                       |
| user_profile                                    | Заметки о клиенте в user_profile (пожелания, личное)                                                                                    |
| создание пользователя в notion и присвоение UTM | Только при /start                                                                                                                       |


### База знаний RAG — Notion → LightRAG

- Trigger: Notion Trigger (poll)
- Workflow: [https://n8n.sarasvatiplace.online/workflow/fFY3TIQEmrzeKxRF](https://n8n.sarasvatiplace.online/workflow/fFY3TIQEmrzeKxRF)

Поддерживает актуальный индекс FAQ для инструмента VECTOR агента: раз в несколько минут опрашивается база Notion «База знаний ии бота» (добавление и обновление страниц). Строки фильтруются по наличию ответа, поля мапятся в узле Edit (id из unique_id Notion, category, question, answer, host [https://lightrag.nhc.live](https://lightrag.nhc.live)). Для каждой записи выполняется upsert в PostgreSQL таблицу lightrag, из вопроса и ответа собирается Markdown-файл и по HTTP multipart отправляется в LightRAG (POST /documents/upload), затем запуск сканирования POST /documents/scan и опрос track_status до статуса processed; при обновлении существующей записи возможна цепочка удаления старого документа (DELETE /documents/delete_document) и повторная загрузка. Итоговые track_id и doc_id сохраняются обратно в lightrag.

#### Шаги

- Два Notion Trigger (add и pageUpdatedInDatabase) с опросом каждые 5 минут по одной базе данных.
- Filter отбрасывает записи без содержательного ответа.
- Edit нормализует поля и задаёт host сервера LightRAG.
- Loop Over Items обрабатывает карточки по одной.
- Upsert в таблицу lightrag (instance_id, category, content).
- Code формирует Markdown FAQ и бинарный файл для загрузки.
- Ветвление: если для строки ещё нет track_id — загрузка и scan; иначе опрос статуса, при необходимости удаление прежнего документа и повторная загрузка.
- Ожидания Wait и повторные запросы track_status до завершения индексации.
- Обновление track_id и doc_id в lightrag после успешной обработки.

#### Подробности

### LightRAG

Публичный веб-интерфейс экземпляра: [https://lightrag.nhc.live/webui/#/](https://lightrag.nhc.live/webui/#/) — там же можно проверить состояние документов и индекса.

### HTTP API (узлы workflow)


| Метод / путь                           | Назначение                                                |
| -------------------------------------- | --------------------------------------------------------- |
| POST …/documents/upload                | Multipart: загрузка Markdown-файла FAQ                    |
| POST …/documents/scan                  | Запуск сканирования загруженного файла                    |
| GET …/documents/track_status/:track_id | Опрос статуса обработки до processed                      |
| POST …/documents/delete_document       | Удаление версии документа перед перезагрузкой при правках |


### Связь с основным ботом

Диалоговый workflow вызывает инструмент VECTOR к тому же хранилищу знаний; этот сценарий только наполняет и обновляет индекс из Notion.

### PAYMENT_LINK — ссылка на оплату

- Trigger: Execute Workflow (из агента)
- Workflow: [https://n8n.sarasvatiplace.online/workflow/HapccSt57DGnNq9O](https://n8n.sarasvatiplace.online/workflow/HapccSt57DGnNq9O)

Сценарий формирования QR-кода и ссылки на оплату: под-workflow принимает контакты и параметры события, сохраняет строку в event_registrations (PostgreSQL), затем через API Т-Банка (Tinkoff Acquiring) выполняет Init платежа и GetQr — возвращает данные для оплаты (QR / payload) в поле link для агента.

#### Шаги

- Сценарий предназначен для выпуска платёжного QR и/или ссылки после согласования суммы и контактов.
- Триггер «When Executed by Another Workflow» получает входные поля от вызывающего сценария (см. таблицу ниже).
- Insert rows in a table — вставка в PostgreSQL таблицу event_registrations: email, нормализованный phone, username, currency, event_name, price, event_id, full_name.
- Set creds & params — подстановка параметров терминала, суммы в копейках (price × 100), OrderId, описания платежа; готовится тело для подписи Init.
- Code → Crypto (SHA256) → Tbank Init: POST [https://securepay.tinkoff.ru/v2/Init](https://securepay.tinkoff.ru/v2/Init) с токеном по правилам Т-Банка.
- После ответа Init — Code формирует строку подписи для GetQr → Crypto → TBAnkQR: POST [https://securepay.tinkoff.ru/v2/GetQr](https://securepay.tinkoff.ru/v2/GetQr).
- Code in JavaScript возвращает { link } из ответа GetQr (поле Data) — это передаётся основному workflow агента.

#### Подробности

### QR и ссылка на оплату

Это тот же под-workflow PAYMENT_LINK: он не только сохраняет заявку, но и по цепочке Init → GetQr получает от Т-Банка материал для оплаты — QR-код и/или данные, из которых пользователь переходит к оплате (в зависимости от ответа API и DataType).

### Входные параметры под-workflow


| Поле       | Назначение                                                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| email      | Email для DATA в Init                                                                                                         |
| phone      | Телефон; в Insert — нормализация цифр и префикса для РФ                                                                       |
| username   | Username Telegram и запись в заявку                                                                                           |
| currency   | Валюта заявки                                                                                                                 |
| event_name | Название события; в Set — Description платежа                                                                                 |
| date       | Дата события во входе триггера; в экспорте узла Insert не маппится на event_date — при необходимости добавьте поле в маппинг. |
| price      | Сумма; в Set — Amount = price × 100 (копейки)                                                                                 |
| event_id   | Идентификатор события                                                                                                         |
| full_name  | ФИО в заявку                                                                                                                  |


### Цепочка узлов


| Узел                              | Описание                                                                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| When Executed by Another Workflow | executeWorkflowTrigger с перечисленными полями.                                                                              |
| Insert rows in a table            | PostgreSQL: таблица public.event_registrations; телефон очищается от нецифровых символов и приводится к единому виду для РФ. |
| Set creds & params                | TerminalKey, Password, OrderId (например order-{{$now.toMillis()}}), Description из event_name, Amount, DATA: email и phone. |
| Code in JavaScript1 + Crypto      | Сборка строки подписи Init (ключи по алфавиту, Password только для подписи), SHA256 → token.                                 |
| Tbank Init                        | Регистрация платежа в эквайринге Т-Банка.                                                                                    |
| Code in JavaScript3 + Crypto1     | Подпись запроса GetQr по PaymentId и параметрам терминала.                                                                   |
| TBAnkQR                           | Запрос QR / payload для оплаты (DataType из предыдущих шагов).                                                               |
| Code in JavaScript                | Формирует возврат под-workflow: { link } из поля Data ответа GetQr (payload/QR или данные для оплаты — по ответу Т-Банка).   |


### Безопасность

Пароль терминала и секреты подписи не должны храниться в открытом виде в узлах Code и Set в продакшене: вынесите их в credentials n8n или переменные окружения и подставляйте в узлы. Если секреты попали в экспорт workflow или в репозиторий — смените пароль в личном кабинете Т-Банка.

### Когда вызывается

- Пользователь готов оплатить: тариф и событие согласованы, контакты собраны.
- После вызова в заявке уже есть строка в event_registrations; затем пользователь получает QR или ссылку из ответа GetQr.

### order — заявки

- Trigger: Execute Workflow (из агента)
- Workflow: [https://n8n.sarasvatiplace.online/workflow/q4IDS4V1pLnRxurR](https://n8n.sarasvatiplace.online/workflow/q4IDS4V1pLnRxurR)

Инструмент order в n8n — сценарий заявок: короткий под-workflow с триггером create_order принимает поля заявки и одним узлом Supabase создаёт строку в event_registrations (те же заявки, что отображаются в разделе заявок админки).

#### Шаги

- Агент распознаёт намерение зарегистрироваться или оставить заявку на участие.
- Вызывается под-workflow order: входные данные передаются в узел create_order (executeWorkflowTrigger).
- Узел Create a row (Supabase) вставляет запись в таблицу event_registrations с маппингом полей (см. ниже).
- Ответ основного сценария агента пользователю формируется уже за пределами этого под-workflow.

#### Подробности

### Терминология

В коде и инструментах агента поле называется order; по смыслу это заявки пользователей (участие в мероприятии и данные для связи). Запись попадает в event_registrations.

### Узлы n8n


| Узел         | Описание                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| create_order | executeWorkflowTrigger: точка входа с именованными входами для вызова из основного диалогового workflow. |
| Create a row | Supabase: операция создания строки в таблице event_registrations.                                        |


### Входные параметры под-workflow


| Поле         | Назначение                                      |
| ------------ | ----------------------------------------------- |
| email        | Email заявителя                                 |
| phone        | Телефон                                         |
| firstname    | Имя                                             |
| secondname   | Отчество                                        |
| lastname     | Фамилия                                         |
| placement    | Название / формулировка мероприятия (программа) |
| placement_id | Идентификатор размещения / события              |
| username     | Username в Telegram                             |
| chat_id      | Идентификатор чата Telegram (число)             |


### Маппинг в event_registrations


| Колонка    | Значение                                                               |
| ---------- | ---------------------------------------------------------------------- |
| email      | {{ $json.email }} в нижнем регистре                                    |
| full_name  | Строка из фамилии, имени и отчества: lastname + firstname + secondname |
| phone      | {{ $json.phone }} после trim()                                         |
| event_name | {{ $json.placement }}                                                  |
| event_id   | {{ $json.placement_id }}                                               |
| username   | {{ $json.username }}                                                   |
| chat_id    | {{ $json.chat_id }}                                                    |


### Отличие от PAYMENT_LINK

Сценарий order (заявки) только сохраняет заявку в Supabase без эквайринга. PAYMENT_LINK дополнительно создаёт строку заявки (в вашей схеме через PostgreSQL), регистрирует платёж Init/GetQr и возвращает QR или данные оплаты.

### Отличие от оплаты

Заявка фиксирует участие и данные в event_registrations; оплата может быть позже через PAYMENT_LINK или вручную.

### Когда вызывается

- Пользователь хочет записаться, оставить заявку или зарезервировать место без немедленной оплаты.
- Нужна проверка условий или слотов перед выставлением платежа.

### tariffs — тарифы по событию

- Trigger: Execute Workflow
- Workflows:
  - Инструмент tariffs (ответ агенту): [https://n8n.sarasvatiplace.online/workflow/ElVM6RZdJoXja3AM](https://n8n.sarasvatiplace.online/workflow/ElVM6RZdJoXja3AM)
  - Синхронизация Notion → БД (события для тарифов): [https://n8n.sarasvatiplace.online/workflow/QoDVPU65aCDQEANu](https://n8n.sarasvatiplace.online/workflow/QoDVPU65aCDQEANu)

Тарифы для ответов агента опираются на данные в Supabase. Отдельный под-workflow синхронизирует события из Notion в БД (таблица notion_events); второй workflow — инструмент tariffs в диалоге «Виктории», который по запросу агента возвращает тарифы по событию.

#### Шаги

- Сценарий синхронизации вызывается другим workflow и переносит / актуализирует события из Notion в Supabase (слой notion_events), чтобы тарифы не подтягивались напрямую из Notion в момент ответа.
- В основном боте агент вызывает инструмент tariffs с идентификатором или контекстом события.
- Инструмент читает актуальные строки из БД (события и связанные тарифные данные по вашей схеме в n8n).
- Ответ нормализуется и возвращается агенту для формулировки ответа пользователю.

#### Подробности

### Синхронизация Notion → БД

Workflow QoDVPU65aCDQEANu — триггер «When Executed by Another Workflow» (executeWorkflowTrigger): запуск из другого сценария. Назначение — наполнять или обновлять данные событий в Supabase после правок в Notion.


| Узел                              | Описание                                                                                                               |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| When Executed by Another Workflow | Точка входа: под-workflow вызывается извне.                                                                            |
| Get many rows                     | Supabase: операция getAll по таблице notion_events; фильтр date_start ≥ {{ $now }} — только текущие и будущие события. |
| Replace me with your logic        | Узел noOp — заглушка: сюда подключается логика записи и сопоставления полей Notion ↔ Supabase.                         |


### Инструмент tariffs в диалоге

Workflow ElVM6RZdJoXja3AM вызывается инструментом tariffs основного агента: по выбранному событию возвращает структурированные тарифы из БД (после синхронизации).

### Связь с EVENT

Инструмент EVENT даёт список и свойства событий; tariffs детализирует цены и условия по конкретной программе.

### Когда вызывается инструмент tariffs

- Вопросы «сколько стоит», «какие пакеты», «что входит» по программе.
- Сравнение предложений после того, как пользователь выбрал событие.

### user_profile — заметки о клиенте

- Trigger: Execute Workflow (из агента)
- Workflow: [https://n8n.sarasvatiplace.online/workflow/GTmQY0aVDFqGH3CF](https://n8n.sarasvatiplace.online/workflow/GTmQY0aVDFqGH3CF)

Короткий под-workflow: сохраняет в Supabase таблицу user_profile свободный текст о пользователе (пожелания, аллергии, личное — как сформулировал агент) и username для группировки.

#### Шаги

- Триггер «When Executed by Another Workflow» принимает два входа: текст заметки и username.
- Узел Create a row (Supabase) создаёт строку в таблице user_profile: description ← текст заметки, username ← Telegram username.
- Основной диалог бота может не ждать завершения записи — типичный асинхронный вызов инструмента.

#### Подробности

### Смысл таблицы user_profile

Это не единственная строка «карточки клиента», а журнал: при каждом сохранении добавляется новая запись с тем же username и новым текстом в description. Подробности см. вкладку «Таблицы» → раздел «Заметки о пользователях»; агрегированный просмотр — в разделе приложения «Профили пользователей».

### Узлы n8n


| Узел                              | Описание                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------ |
| When Executed by Another Workflow | Входы: message_user_profile (текст для description) и username.                |
| Create a row                      | Supabase: таблица user_profile; поля username и description маппятся из входа. |


### Замечание по имени входа

В экспорте workflow поле названо message_user_profile с пробелом в конце; в выражении используется $json["message_user_profile "]. Имеет смысл переименовать вход в n8n без пробела, чтобы не ошибаться при вызове.

### Когда вызывается

- Пользователь говорит что-то личное или важное для организации ретрита.
- Агент через инструмент фиксирует сжатую формулировку в user_profile для кураторов.

### Создание пользователя в Notion и присвоение UTM

- Trigger: Execute Workflow (из /start)

Вызывается только на маршруте /start: регистрирует пользователя в Notion и проставляет UTM-метки для аналитики переходов и кампаний.

#### Шаги

- После Switch → start запускается параллельно с проверками Bothelp и загрузкой контекста.
- Создаётся или обновляется запись в базе Notion по telegram_id и username.
- UTM подтягиваются из параметров старта бота, deep link или сохранённых атрибутов сессии.
- Ошибки Notion не блокируют приветственное сообщение пользователю в основном потоке.

#### Подробности

### Связь с основным сценарием

В документации основного workflow это же действие упомянуто как Call «создание пользователя в notion и присвоение UTM» при первом контакте.

### Назначение данных


| Данные                       | Зачем                                     |
| ---------------------------- | ----------------------------------------- |
| Notion-страница пользователя | Единая карточка лида для команды Академии |
| UTM                          | Атрибуция источника и кампании            |


### Эскалация обращения

- Trigger: Инструмент escalation + расписание
- Workflows:
  - Запись эскалации из агента: [https://n8n.sarasvatiplace.online/workflow/jWyNP3UGQlKaDQtG](https://n8n.sarasvatiplace.online/workflow/jWyNP3UGQlKaDQtG)
  - Рассылка кураторам (schedule trigger): [https://n8n.sarasvatiplace.online/workflow/EgMXItRIU2dL1ZOd](https://n8n.sarasvatiplace.online/workflow/EgMXItRIU2dL1ZOd)

Два связанных workflow в n8n: (1) вызов из основного диалогового сценария записывает строку в escalation_message с username, message, summary и chat_id; (2) по расписанию каждые 10 минут выбираются строки со status=false, в Telegram группу уходит текст заявки, затем status=true.

#### Шаги

- Агент вызывает инструмент escalation с username, текстом сообщения пользователя, сводкой (summary) и chat_id.
- Под-workflow создаёт строку в Supabase escalation_message через узел esc_message (поля совпадают со входами триггера).
- Отдельный сценарий раз в 10 минут загружает записи с status=false.
- Для каждой строки отправляется сообщение в Telegram (группа и тема задаются в узле Telegram).
- После отправки строка обновляется: status=true. Заглушка Replace Me возвращает управление циклу.

#### Подробности

### Workflow записи (jWyNP3UGQlKaDQtG)


| Узел                              | Описание                                                                                                 |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| When Executed by Another Workflow | Входы: username, message, summary, chat_id.                                                              |
| esc_message                       | Supabase — создание строки в escalation_message; ошибки узла не рвут основной поток (onError: continue). |


### Workflow рассылки по расписанию (EgMXItRIU2dL1ZOd)


| Узел                 | Описание                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Schedule Trigger     | Интервал 10 минут.                                                                                                       |
| esc_message1         | Supabase getAll по escalation_message с фильтром status is false.                                                        |
| Loop Over Items      | Разбор очереди необработанных строк.                                                                                     |
| Send a text message1 | Telegram: текст с username, message и summary; HTML; при необходимости topic (message_thread_id) для темы в супергруппе. |
| esc_message2         | Обновление той же строки по id: status = true.                                                                           |
| Replace Me           | Узел-заглушка перед возвратом в Loop Over Items.                                                                         |


### Примечание по секретам

Идентификатор группы Telegram, топик и токен бота заданы в узле Telegram — не коммитьте экспорт workflow с живыми секретами в открытый репозиторий.

### Фоллоу-ап при молчании пользователя

- Trigger: Schedule Trigger (интервал по минутам)
- Workflow: [https://n8n.sarasvatiplace.online/workflow/H24KvgSNJ8vS3TwU](https://n8n.sarasvatiplace.online/workflow/H24KvgSNJ8vS3TwU)

Отдельный сценарий по расписанию (на схеме — каждые 5 минут): находит чаты, где последнее значимое сообщение — от агента без признака фоллоу-апа, пользователь после этого не писал дольше порога из escalation_levels; два шага ИИ проверяют, что диалог действительно «завис» на ожидании ответа, затем формируют короткое ненавязчивое напоминание на языке клиента, сохраняют строку в dialogs с is_followup=true и отправляют её в Telegram.

#### Шаги

- Schedule Trigger периодически запускает цепочку.
- Узел Postgres «Select Escalation Candidates»: SQL по таблицам dialogs, escalation_levels и unanswered_escalations — чаты, где последнее «обычное» сообщение агента (role = agent, is_followup = false) старше threshold включённого уровня, при этом пользователь не отвечал после агента; исключаются уже зафиксированные комбинации в unanswered_escalations.
- INSERT в unanswered_escalations (ON CONFLICT DO NOTHING) помечает попытку по tg_chat_id, dialogs_id и level.
- При ненулевом числе кандидатов — Split in Batches / цикл по элементам.
- Для каждого чата: выборка последних 7 строк dialogs, агрегация истории.
- Агент «проверка диалога» (GPT-4.1 + structured JSON): статус completed | waiting_user | active и признак agent_waits_for_user.
- Фильтр пропускает только сценарии, где агент действительно ждёт пользователя.
- Агент «Фоллоу-ап»: 1–2 предложения, без продажного давления, язык по последнему сообщению пользователя.
- Узел Supabase «create_message» создаёт в dialogs сообщение агента с is_followup = true; затем Telegram Send пользователю.
- Заглушка Replace Me замыкает цикл обработки очереди.

#### Подробности

### Источники данных в PostgreSQL

Узлы Postgres в workflow подключены к той же базе, где лежат таблицы Supabase (public.dialogs и др.). Поля в aggregate могут называться message в зависимости от схемы — ориентируйтесь на фактические имена колонок в вашей БД.

### Таблицы и поля


| Объект                 | Роль                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| dialogs.is_followup    | Различает обычные ответы агента и автоматические напоминания; при выборе «последнего агента» учитываются только строки с false. |
| escalation_levels      | Включённые уровни с полями level, threshold (interval), is_enabled — задают задержки напоминаний.                               |
| unanswered_escalations | Не даёт повторно отправить фоллоу-ап для того же dialogs_id и level.                                                            |


### Узлы по смыслу


| Узел                             | Описание                                                            |
| -------------------------------- | ------------------------------------------------------------------- |
| Schedule Trigger                 | Периодический запуск (интервал задаётся в параметрах триггера).     |
| Select Escalation Candidates     | Execute query — отбор кандидатов по SQL.                            |
| Execute a SQL                    | Регистрация попытки в unanswered_escalations.                       |
| Summarize / Merge / If           | Подсчёт количества и вход в цикл только при наличии строк.          |
| Loop Over Items                  | Порядковая обработка кандидатов.                                    |
| Select rows dialogs + Aggregate  | Контекст последних сообщений для ИИ.                                |
| проверка диалога                 | LangChain agent + Structured Output Parser — классификация диалога. |
| Филтр на необходимость ФОЛЛУ-АПП | Условие по agent_waits_for_user.                                    |
| Фоллоу-ап                        | LangChain agent (GPT-4.1) — текст напоминания.                      |
| create_message (Supabase)        | Вставка строки в dialogs с is_followup = true.                      |
| Send (Telegram)                  | Отправка текста в чат пользователя.                                 |


### Справочник порогов

Актуальные значения уровней и интервалов смотрите в таблице escalation_levels (например через Supabase REST: GET …/escalation_levels?select=* с заголовками apikey и Authorization). На sticky-заметке в workflow указаны ориентиры по интервалу запуска и примерам порогов — сверяйте с данными в БД.
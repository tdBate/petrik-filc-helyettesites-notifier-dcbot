import { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } from "discord.js";
import { RootSubstitution, Teacher2 } from "./models/substitutionModels";
import { RootNews } from "./models/announcementModels";
import { ShortSubstitution, ServerData, ShortNews, ShortMovedLesson } from "./models/createdModels";
import { createSubMessageText, detectSubChanges, filterData, isSubClassImpacted, parseNews, parseSubstitution, saveServerData, detectNewsChanges, isNewsClassImpacted, createNewsMessageText, parseMovedLesson, detectMovedLessonChanges, isMovedClassImpacted, createMovedMessageText } from "./tools";
import fs from "node:fs";
import "dotenv/config";
import { RootMovedLesson } from "./models/movedLessonModels";

//url stuff
const URL_SUBSTITUTIONS: string = "https://filc.petrik.hu/api/timetable/substitutions";
const URL_NEWS: string = "https://filc.petrik.hu/api/news/announcements";
const URL_MOVED_LESSONS = "https://filc.petrik.hu/api/rpc/timetable/movedLessons/list";
const TEACHER_LINK = "https://filc.petrik.hu/api/rpc/timetable/teachers/getAll";

//constants stuff
const CYCLE_TIME = (1000 * 60) * 5; //last (one min in secs) * mins
const FETCH_TIMEOUT_MS = 30000;

//data stuff
let substitutionData: RootSubstitution[];
let newsData: ShortNews[];
let serverData: ServerData[];
let movedData: ShortMovedLesson[];
export let teachersList: Teacher2[]

async function setup() {
    substitutionData = JSON.parse(fs.readFileSync("./data/substitutions.json").toString());
    newsData = JSON.parse(fs.readFileSync("./data/announcements.json").toString());
    movedData = JSON.parse(fs.readFileSync("./data/movedlessons.json").toString());
    serverData = JSON.parse(fs.readFileSync("./data/servers.json").toString());
}

async function getSubData() {
    try {
        const response: Response = await fetch(URL_SUBSTITUTIONS, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const new_substitutionData: RootSubstitution[] = filterData(JSON.parse(await response.text()).items);

        //check for changes
        if (JSON.stringify(new_substitutionData) != JSON.stringify(substitutionData)) {
            const changes: RootSubstitution[] = detectSubChanges(substitutionData, new_substitutionData);
            //if (changes.length>10) {throw new Error("Too much new data");}
            for (let i = 0; i < changes.length; i++) {
                const shortSub = parseSubstitution(changes[i]);
                if (shortSub != null) {
                    await sendSubMessage(shortSub);
                }
            }

            substitutionData = new_substitutionData;
            fs.writeFileSync("./data/substitutions.json", JSON.stringify(substitutionData));
            console.log("Update detected...");
        }
    } catch (err) {
        console.error(err);
    }
}

async function getNewsData() {
    try {
        const response: Response = await fetch(URL_NEWS, {
            method: "GET",
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                Cookie: `__Secure-filc.session_token=${process.env.SESSION_TOKEN}`
            }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const new_newsData = JSON.parse(await response.text()).items.map((item: RootNews) => parseNews(item)) as ShortNews[];
        if (!new_newsData) {
            throw new Error("Error in parsing new");
        }

        //check for changes
        if (JSON.stringify(new_newsData) != JSON.stringify(newsData)) {
            const changes: ShortNews[] = detectNewsChanges(newsData, new_newsData);
            //if (changes.length>10) {throw new Error("Too much new data");}
            for (let i = 0; i < changes.length; i++) {
                const shortNew = changes[i];
                if (shortNew != null) {
                    await sendNewsMessage(shortNew);
                }
            }

            newsData = new_newsData;
            fs.writeFileSync("./data/announcements.json", JSON.stringify(newsData));
            console.log("Update detected...");
        }
    } catch (err) {
        console.error(err);
    }
}

async function getTeachers() {
    try {
        const response: Response = await fetch(TEACHER_LINK, {
            method: "GET",
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                Cookie: `__Secure-filc.session_token=${process.env.SESSION_TOKEN}`
            }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        teachersList = JSON.parse(await response.text()).json.items as Teacher2[];
    } catch (err) {
        console.error(err);
    }
}

async function getMovedData() {
    try {
        const response: Response = await fetch(URL_MOVED_LESSONS, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const new_movedData: ShortMovedLesson[] = JSON.parse(await response.text()).json.items.map((item: RootMovedLesson) => parseMovedLesson(item));
        //console.log(JSON.stringify(new_movedData))

        //check for changes
        if (JSON.stringify(new_movedData) != JSON.stringify(movedData)) {
            const changes: ShortMovedLesson[] = detectMovedLessonChanges(movedData, new_movedData);
            //if (changes.length>10) {throw new Error("Too much new data");}
            for (let i = 0; i < changes.length; i++) {
                const movedLesson = changes[i];
                if (movedLesson != null) {
                    await sendMovedMessage(movedLesson);
                }
            }

            movedData = new_movedData;
            fs.writeFileSync("./data/movedlessons.json", JSON.stringify(movedData));
            console.log("Update detected...");
        }
    } catch (err) {
        console.error(err);
    }
}

//discord stuff
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function setupDiscord() {
    client.login(process.env.DISCORD_TOKEN);

    const commands = [
        new SlashCommandBuilder().setName("set-output-channel").setDescription("Sets bot output to current channel"),
        new SlashCommandBuilder()
            .setName("set-class")
            .setDescription("Selects what class to filter")
            .addStringOption(option => option.setName("class").setDescription('Format: "13.e" or "all"'))
    ].map(command => command.toJSON());

    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN as string);

    (async () => {
        try {
            console.log("Registering slash commands...");
            await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID as string), { body: commands });
            console.log("Slash commands registered successfully.");
        } catch (error) {
            console.error("Error registering commands:", error);
        }
    })();

    client.on("interactionCreate", async interaction => {
        if (!interaction.isChatInputCommand()) return;
        if (!interaction.guildId) {
            return interaction.reply("Can only be used in a server");
        }

        if (interaction.commandName == "set-output-channel") {
            const serverIndex = serverData.findIndex(item => item.server_id == interaction.guildId);
            if (serverIndex != -1) {
                serverData[serverIndex].channel_id = interaction.channelId;
            } else {
                const server: ServerData = {
                    server_id: interaction.guildId,
                    channel_id: interaction.channelId,
                    cohort: ""
                };
                serverData.push(server);
            }
            saveServerData(serverData);

            await interaction.reply("Bot added to channel");
        } else if (interaction.commandName == "set-class") {
            const userInput = interaction.options.getString("class")?.toUpperCase().trim();

            const serverIndex = serverData.findIndex(item => item.server_id == interaction.guildId);

            if (serverIndex != -1) {
                serverData[serverIndex].cohort = userInput!;
            } else {
                return interaction.reply("Error: first set bot output");
            }
            saveServerData(serverData);
            return interaction.reply("Class selected");
        }
    });

    client.once("clientReady", () => {
        client.user?.setStatus("online");
        console.log("bot online");
        main();
    });
}

async function sendToChannel(channelId: string, text: string) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel && channel.isSendable()) {
            await channel.send(text);
        }
    } catch (err) {
        console.error(`Sending failed:`, err);
    }
}

async function sendSubMessage(data: ShortSubstitution) {
    const text = createSubMessageText(data);

    for (let i = 0; i < serverData.length; i++) {
        if (isSubClassImpacted(data, serverData[i].cohort)) {
            //check if selected class is impacted
            await sendToChannel(serverData[i].channel_id, text);
        }
    }
}

async function sendNewsMessage(data: ShortNews) {
    const text = createNewsMessageText(data);

    for (let i = 0; i < serverData.length; i++) {
        if (isNewsClassImpacted(data, serverData[i].cohort)) {
            await sendToChannel(serverData[i].channel_id, text);
        }
    }
}

async function sendMovedMessage(data: ShortMovedLesson) {
    const text = createMovedMessageText(data);

    for (let i = 0; i < serverData.length; i++) {
        if (isMovedClassImpacted(data, serverData[i].cohort)) {
            await sendToChannel(serverData[i].channel_id, text);
        }
    }
}

async function mainCycle() {
    await getSubData();
    await getNewsData();
    await getMovedData();
}

async function main() {
    await setup();
    await getTeachers();
    await mainCycle();

    const scheduleNext = () =>
        setTimeout(async () => {
            try {
                await mainCycle();
            } catch (err) {
                console.error("Err:", err);
            } finally {
                scheduleNext();
            }
        }, CYCLE_TIME);
    scheduleNext();
}

setupDiscord();

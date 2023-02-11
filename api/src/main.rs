//! This is the documentation for the study designer for the momenTUM project.
//!
//! It encompasses technical documentation for the API and frontend of the study designer.
//! 
//! # Frontend
//!
//! The frontend is written in React and Typescript and is located in the `frontend` folder.
//! Notable used libraries are:
//! - [TailwindCSS](https://tailwindcss.com) for styling using utility classes. I also use TailwindUI, which provides a lot of pre-made components (We bought a license, ask Manuel).
//! - [ReactFlow](https://reactflow.dev/) for diplaying a graph of the study
//! - [ReactJsonSchemaForm](https://github.com/rjsf-team/react-jsonschema-form) for creating a form based on a JSON schema and validating its correctness
//! - [Zustand](https://github.com/pmndrs/zustand) for state management, it stores all the data that is needed for the study designer
//!
//! The frontend is can be build by running `npm run build` in the `frontend` folder. (Although I recommend using pnpm instead of npm)
//! The build output is located in the `frontend/dist` folder. This folder is served by the API under the base route `/`, while all API-specific requests are handled under `/api/v1/`.
//! In production, the `preview` git branch is also served under `/preview`, allowing you to show people a feature still under development.
//!
//! ## Atoms
//! The frontend uses an abstraction layer when it comes to storing and retrieving study data:
//!
//! All of the several types of content for the study, like modules, questions, sections and the properties object, are abstracted away into a so-called Atom. Its type definition is:
//!
//! ```
//!// As defined in types.d.ts
//!declare interface Atom<T> {
//!    parent: string | null;
//!    subNodes: string[] | null;
//!    type: AtomVariants;
//!    childType: AtomVariants | null;
//!    content: T;
//!    title: string; // Displayed on node
//!    actions: Actions[];
//!    hidden: boolean;
//!  }
//!```
//! Next to the actual content that a user provides, such as the question text, which is stored in the `content` field, 
//! an Atom also stores information about its position in the study graph, such as its parent and children, and its type.
//! 
//! The actions field is used to store the actions that are available for the user to perform on the node. 
//! For example, a section node has the actions `add`, `delete`, `earlier`, and `later`. 
//! These actions are stored as an array of strings, which are then mapped to the corresponding action handler. 
//! Then, buttons are rendered on each node, which call the corresponding action handler when clicked.
//!
//! Each Atom has a unique ID, automatically generated by `nanoid()` and is stored in a hashmap. 
//! This benefits performance, as it allows for O(1) access to the atoms, instead of searching through all nodes sequentially.
//! The atoms are stored in a global state object, which is managed by Zustand. 
//! This allows for easy access to the atoms from anywhere in the application, just by using the `useStore` hook.
//! 
//! ```
//! import { useStore } from "./state";
//! const {atoms} = useStore();
//! ``` 
//! ## Reacting to change
//! Whenever a user clicks on a node in the study graph, the corresponding Atom is retrieved from the global state object
//! and a form is rendered based on the content of the Atom. The corresponding form is generated by retreiving the JSON schema for the Atom's type from the `schema` folder.
//! Whenever the user changes the content of the form, the corresponding Atom is updated in the global state object.
//! 
//! ``` 
//! setAtom: (id, content) =>
//!    set(
//!        produce((state: State) => {
//!          const atom = state.atoms.get(id)!;
//!          atom.content = content;
//!          ... // Some details omitted
//!        })
//!      ),
//!
//!```
//! 
//! The updating is done using the `produce` function from the `immer` library.
//! 
//! ## Graph
//! Whenever the number of atoms changes, such as when a new atom is added or an atom is deleted, the study graph is re-calculated. 
//! This is handled by the `useGraph` hook in the `Graph.tsx` file. 
//! 
//! ```
//! function useGraph(): [Node[], Edge[]] {
//!  let { atoms, selectedNode, direction, forceRedraw } = useStore();
//!  
//! const visibleAtoms = useMemo(
//!    () => hideAtoms(selectedNode || "study", atoms),
//!    [selectedNode, atoms.size, forceRedraw]
//!  );
//! 
//!  let [nodes, edges] = useMemo(
//!    () => calcGraphFromAtoms(visibleAtoms), 
//!    [visibleAtoms, direction]);
//! 
//!  [nodes, edges] = useMemo(
//!    () => alignNodes(nodes, edges, direction),
//!    [nodes, edges, direction, visibleAtoms]
//!  );
//! 
//!  return [nodes, edges];
//!}
//! ```
//! 
//! Ordinarily, the Graph component would be rerendered every time one of the deconstructed items of the `useStore()` hook changes. 
//! However, it would be unnecessary to do this on every key-press when the user types something into a form.
//! Therefore, this hooks makes use of `useMemo`, to only re-run a callback function when one of the items in the dependency array changes.
//! 
//! First, the `hideAtoms()` function is called, which returns a new hashmap of atoms, where all atoms that are not supposed to be visible have their `hidden` field set to `true`.
//! This is used to hide atoms that are not part of the currently selected branch of the study graph. For example, when the user edits a question of one module, questions of other modules are not shown. 
//! 
//! Next, the `calcGraphFromAtoms()` function is called, which returns an array of nodes and edges by iterating through the atoms hashmap and connecting them according to the `parent` and `subnodes` fields.
//! 
//! Finally, the `alignNodes()` function is called, which aligns the nodes in the graph according to the `direction` field of the global state object. 
//! The layout is performed by the `dagre` library, which creates a neat arrangement of the nodes and edges.
//! 
//! The final graph is then handed to ReactFlow, which displays it on the screen. 
//! 
//! ## Creating the actual study
//! 
//! Once the user is done editing the study, they have several options to proceed.
//! Most of them are included in the `Actions` dropdown menu, and defined in the `actions.ts` file. 
//! 
//! As an expample, let's go through the Upload-Action.
//! 
//! When a user clicks on the Upload button, a modal is rendered, which guides the user through the process of uploading the study to the server.
//! 
//! Within the Upload.tsx component, the progress of the upload is tracked using a `useEffect` hook, which has several steps defined in it. 
//! 
//! ```
//!  const [step, setStep] = useState(0);
//!  const { atoms, setModal, setPermalink } = useStore();
//!  const study: Study = useMemo(() => constructStudy(atoms), []);
//!  useEffect(() => {
//!    if (step < 0 || step > 3) return;
//!    const actions = [
//!      //  Authenticate
//!      () =>
//!        new Promise((resolve, reject) => {
//!          resolve(null);
//!        }), // Not yet implemented
//!      // Validate
//!      () =>
//!        new Promise((resolve, reject) =>
//!          validateStudy(study) ? resolve(null) : reject("Study is invalid")
//!        ),
//!      // Upload
//!      () => upload(study),
//!      // Finished
//!      () => new Promise((resolve, reject) => resolve(null)),
//!    ];
//!    actions[step]()
//!      .then((result) => {
//!        if (step === 2) setPermalink(result as string);
//!        setStep(step + 1);
//!      })
//!      .catch((e) => toast.error(e));
//!  }, [step]);
//! ```
//! 
//! Basically, we go through the list of actions and execute them one after another, always waiting for
//! the previous action to finish before starting the next one by awaiting the promise to return.
//! 
//! The first action is to authenticate the user. This is not yet implemented, so it just returns a resolved promise.
//! Then, we build the study from the atoms (which is not unlike building the graph earlier) and validate it.
//! If the validation fails, we show an error message and stop the upload process.
//! 
//! If the validation succeeds, we upload the study to the server. This is done by calling the `upload()` function, which is defined in the `upload.ts` file.
//! The API then validates the study again and saves it to the database and returns a permanent ID for this specific version of the study.
//! 
//! We then take this ID and create two QR-Codes, one for this exact version of the study, and one which always points to the latest version of the study (by using the user-specified study_id).
//! 
//! Finally, we show the user the QR-Codes and a link to the study, which they can share with others.
//! 
//! So, what goes on inside the API?
//! 
//!  # API
//! 
//! The API is written in [Rust](https://www.rust-lang.org/), using the [Rocket](https://rocket.rs/) web framework and a [MongoDB](https://www.mongodb.com/) database.
//! I chose this stack because Rust enables us to write fast, correct code, and Rocket is a very easy to use web framework.
//! The main benefit of using Rust is its strict type system (even stricter than TypeScript),
//! which allows us to be confident, that studies are always valid and that the API will never crash (Well, hopefully).
//! 
//! Therefore, THE DIFINITIVE REFERENCE IMPLEMENTATION OF THE STUDY FORMAT IS THE ONE IN `study.rs`.
//! 
//! The type safety then allows us to nicely precise code like this: 
//! 
//! ```
//! #[post("/api/v1/study", data = "<potential_study>")]
//! async fn create_study(
//!     user: User,
//!     db: Connection<DB>,
//!     potential_study: Result<Json<Study>, json::Error<'_>>
//! ) -> Result<String> {
//!     let mut study = potential_study.map_err(|e| error::Error::StudyParsing(e.to_string()))?;
//!     study._id = Some(ObjectId::new());
//!     study.timestamp = Some(DateTime::now().timestamp_millis());
//!     let result = db
//!         .database(ACTIVE_DB)
//!         .collection::<Study>("studies")
//!         .insert_one(&*study, None)
//!         .await?;
//! 
//!     Ok(result.inserted_id.to_string())
//! }
//! ```
//! 
//! First, we define the route this endpoint is listening to via a `#[post]` attribute and declare that there might be a study included in the request body.
//! 
//! Then, we define a handler for the route, called `create_study`, which takes three arguments.
//! The first one is a user object, which is automatically parsed from the request and validated by a Request Guard implemented in `users.rs`. 
//! By including a user in a request, we can guarantee, that only authenticated users can access this endpoint.
//! 
//! The second argument is a database connection, which is also automatically injected by a Request Guard.
//!  We didn't even have to define this guard, because Rocket comes with a built-in one, which is configured to connect to a MongoDB database, like this: 
//! 
//! ```
//! #[derive(Database)]
//! #[database("mongodb")]
//! pub struct DB(mongodb::Client);
//! ```
//! 
//! Lastly, we have the study itself, which is parsed from the request body and validated by Rocket.
//! In this case, we want the guard to return us a `Result`, which is a fundamental type in Rust and can either be `Ok` or `Err`.
//! 
//! If the study is valid, the Result will be `Ok` and contain the parsed study.
//! If the study is invalid, the Result will be `Err` and contain an error message about what exactly is wrong with the study.
//! 
//! In our case, we want to return an error message to the user, if the study is invalid, so we map the `Err` case to our own error type.
//! Then, we return it by using the `?` operator, which is a very convenient way to propagate errors in Rust.
//! 
//! Now we can be sure that we have a valid study, so we can insert it into the database.
//! 
//! This operation also returns a `Result`, which we can use to return an error message to the user, if the database operation fails.
//! 
//! If everything went well, we return the ID of the newly created study to the user.
//! 
//! ## Redcap
//! 
//! The API also contains an endpoint for importing studies into REDCap.
//! 
//! ```
//! #[post("/api/v1/redcap/<username>", data = "<study>")]
//! async fn create_redcap_project(
//!     db: Connection<DB>,
//!     study: Json<Study>,
//!     username: &str,
//! ) -> Result<&'static str> {
//!     let study = study.0;
//!     let api_key = redcap::create_project(&study).await?;
//!     ... // Saving the API key to the database
//!     redcap::import_metadata(&study, api_key.clone()).await?;
//!     redcap::enable_repeating_instruments(&study, api_key.clone()).await?;
//!     redcap::import_user(username, api_key.clone()).await?;
//! 
//!     Ok("...")
//! }
//! ```
//! 
//! As you can see, this endpoint receives a database connection and a study guaranteed to be valid, as well a a redcap username that will be the owner of the new project.
//! 
//! There are five main steps: 
//! 
//! 1. Create a new project in REDCap with a SUPER_API_KEY, which is stored in a .env file 
//! 2. Save the returned project API key in the database
//! 3. Import the metadata of the study into the new project. This includes mapping our modules to RedCap instruments.
//! 4. Enable repeating instruments, so that we can add multiple instances of the same instrument to a single record (Often modules are done once per day).
//! 5. Then we add the specified user as a project admin, so that they can access the project.
//! 

#[macro_use]
extern crate rocket;

use mongodb::options::ReplaceOptions;
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime},
    options::FindOneOptions,
};
use rocket::fairing::{Fairing, Info, Kind};
use rocket::fs::{relative, NamedFile};
use rocket::futures::stream::TryStreamExt;
use rocket::http::Header;
use rocket::Request;
use rocket::{form::Form, serde::json::Json};
use rocket_db_pools::{Connection, Database};
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};
use std::str::FromStr;
use study::Study;

use crate::error::Error;
use crate::redcap::{import_response, Log, Response};
use crate::users::User;

mod error;
mod redcap;
mod study;
mod users;

type Result<T> = std::result::Result<T, Error>;
type PotentialStudy = Result<Json<Study>>;

#[derive(Database)]
#[database("mongodb")]
pub struct DB(mongodb::Client);

#[cfg(debug_assertions)]
pub const ACTIVE_DB: &str = "momenTUM-dev";

#[cfg(not(debug_assertions))]
pub const ACTIVE_DB: &str = "momenTUM";

#[derive(Debug, Serialize, Deserialize)]
pub struct Key {
    pub study_id: String,
    pub api_key: String,
}

#[get("/")]
async fn index() -> Option<NamedFile> {
    let path = Path::new(relative!("../frontend/dist/")).join("index.html");
    NamedFile::open(path).await.ok()
}

#[get("/<path..>")]
async fn assets(path: PathBuf) -> Option<NamedFile> {
    let path = Path::new(relative!("../frontend/dist/")).join(path);
    if path.is_file() {
        NamedFile::open(path).await.ok()
    } else {
        None
    }
}

#[get("/preview")]
async fn preview() -> Option<NamedFile> {
    let path = Path::new(relative!("../frontend/dist-preview/")).join("index.html");
    NamedFile::open(path).await.ok()
}

#[get("/preview/<path..>")]
async fn preview_assets(path: PathBuf) -> Option<NamedFile> {
    let path = Path::new(relative!("../frontend/dist-preview/")).join(path);
    if path.is_file() {
        NamedFile::open(path).await.ok()
    } else {
        None
    }
}

#[get("/api/v1/status")]
fn status() -> &'static str {
    "The V1 API is live!"
}

#[get("/api/v1/studies/<study_id>")]
async fn fetch_study(db: Connection<DB>, mut study_id: String) -> PotentialStudy {
    if study_id.ends_with(".json") {
        study_id = study_id.replace(".json", "");
    }
    let filter = doc! { "$or": [ {"properties.study_id": &study_id}, {"_id": ObjectId::from_str(&study_id).unwrap_or_default()}]};
    let result = db
        .database(ACTIVE_DB)
        .collection::<Study>("studies")
        .find_one(
            filter,
            FindOneOptions::builder()
                .sort(doc! { "timestamp": -1})
                .show_record_id(true)
                .build(),
        )
        .await?;
    match result {
        Some(study) => Ok(Json(study)),
        None => Err(Error::StudyNotFound),
    }
}

#[post("/api/v1/studies/<study_id>")] // Support for legacy schema app, which uses POST to retrieve studies
async fn get_study_by_post(db: Connection<DB>, study_id: String) -> PotentialStudy {
    fetch_study(db, study_id).await
}

#[get("/api/v1/studies")]
async fn all_studies(db: Connection<DB>) -> Result<Json<Vec<Study>>> {
    let cursor = db
        .database(ACTIVE_DB)
        .collection::<Study>("studies")
        .find(doc! {}, None)
        .await?;
    let studies = cursor.try_collect::<Vec<Study>>().await?;
    Ok(Json(studies))
}

#[get("/api/v1/studies/all/<study_id>")]
async fn all_studies_of_study_id(db: Connection<DB>, study_id: String) -> Result<Json<Vec<Study>>> {
    let cursor = db
        .database(ACTIVE_DB)
        .collection::<Study>("studies")
        .find(doc! {"properties.study_id": &study_id}, None)
        .await?;
    let studies = cursor.try_collect::<Vec<Study>>().await?;
    Ok(Json(studies))
}

#[post("/api/v1/study", data = "<potential_study>")]
async fn create_study(
    // user: Result<User>,
    db: Connection<DB>,
    potential_study: std::result::Result<Json<Study>, rocket::serde::json::Error<'_>>, // Use Result to return precise error message instead of catcher route: https://api.rocket.rs/v0.5-rc/rocket/request/trait.FromRequest.html#outcomes
) -> Result<String> {
    // user?; // Tests if user authentication guard was successful.
    let mut study = potential_study.map_err(|e| error::Error::StudyParsing(e.to_string()))?;
    study._id = Some(ObjectId::new());
    study.timestamp = Some(DateTime::now().timestamp_millis());
    let result = db
        .database(ACTIVE_DB)
        .collection::<Study>("studies")
        .insert_one(&*study, None)
        .await?;

    Ok(result.inserted_id.to_string())
}

#[post("/api/v1/response", data = "<submission>")]
async fn save_response(submission: Form<Response>, db: Connection<DB>) -> Result<()> {
    import_response(db, submission.into_inner()).await
}

#[post("/api/v1/log", data = "<submission>")]
async fn save_log(submission: Form<Log>, db: Connection<DB>) -> Result<()> {
    db.database(ACTIVE_DB)
        .collection("logs")
        .insert_one(submission.into_inner(), None)
        .await?;

    Ok(())
}

#[post("/api/v1/redcap/<username>", data = "<study>")]
async fn create_redcap_project(
    db: Connection<DB>,
    study: Json<Study>,
    username: &str,
) -> Result<&'static str> {
    let study = study.0;
    let api_key = redcap::create_project(&study).await?;
    println!("Created project with API key {}", api_key.clone());
    db.database(ACTIVE_DB)
        .collection::<Key>("keys")
        .replace_one(
            doc! {"study_id":&study.properties.study_id},
            Key {
                study_id: study.properties.study_id.clone(),
                api_key: api_key.clone(),
            },
            ReplaceOptions::builder().upsert(true).build(), // For true upsert, new key document will be inserted if not existing before => Only one key per study_id
        )
        .await?;
    redcap::import_metadata(&study, api_key.clone()).await?;
    redcap::enable_repeating_instruments(&study, api_key.clone()).await?;
    redcap::import_user(username, api_key.clone()).await?;

    Ok("Project successfully created. Go to https://tuspl22-redcap.srv.mwn.de/redcap/ to see it.")
}

#[post("/api/v1/user", data = "<new_user>")]
async fn add_user(
    new_user: Json<User>,
    user: Result<User>,
    db: Connection<DB>,
) -> Result<&'static str> {
    let is_admin_user = user?.email == "admin@tum.de";

    if is_admin_user {
        db.database(ACTIVE_DB)
            .collection::<User>("users")
            .insert_one(new_user.0, None)
            .await?;
        Ok("Inserted new user")
    } else {
        Err(Error::NotAdmin)
    }
}

#[catch(422)]
fn catch_malformed_request(req: &Request) -> String {
    format!("{req}")
}

/// Catches all OPTION requests in order to get the CORS related Fairing triggered.
// #[options("/<_..>")]
// fn all_options() {
//     /* Intentionally left empty */
// }

pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(
        &self,
        _request: &'r Request<'_>,
        response: &mut rocket::Response<'r>,
    ) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, GET, PATCH, OPTIONS",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

#[launch]
fn rocket() -> _ {
    dotenv::dotenv().ok();
    println!("The API is using the {ACTIVE_DB} database");

    std::env::var("REDCAP_SUPER_API_TOKEN")
        .expect("REDCAP_SUPER_API_TOKEN must be set for project creation");
    rocket::build()
        .register("/", catchers![catch_malformed_request])
        .attach(DB::init())
        .attach(CORS)
        .mount(
            "/",
            routes![
                index,
                assets,
                status,
                get_study_by_post,
                create_study,
                fetch_study,
                all_studies,
                save_log,
                save_key,
                save_response,
                create_redcap_project,
                all_studies_of_study_id,
                add_user,
                preview,
                preview_assets
            ],
        )
}

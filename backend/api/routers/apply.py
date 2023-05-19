from fastapi import APIRouter, Request, Response, HTTPException, status, BackgroundTasks
from fastapi.responses import ORJSONResponse

from pydantic import BaseModel

from api.models import User, Participation
from api.dependencies import Auth

import openai

import json

import random
from collections import defaultdict

user_application_messages = {}

team_recoms = []

liked_users = {}

disliked_users = {}

# Dummy profiles
user_profiles = {
    "1": {
        'name': 'Dani',
        'age': 17,
        'stack': ['C++', 'Go', 'Linux'],
        'hackathon': 10,
        'work': 'high school',
        'direction': 'fullstack',
        'video': 1,
        'presentation': 1,
        'introduction': 'Dani is a highly experienced hackathon winner and a talented fullstack developer, despite being only 17 years old and a high school student.'
    },
    "699": {
        "name": "Alice Johnson",
        "age": 22,
        "stack": ["Python", "Django", "React"],
        "hackathon": 7,
        "work": "University",
        "direction": "fullstack",
        "video": 2,
        "presentation": 8,
        "introduction": "A dedicated university student, Alice brings full-stack expertise, an exceptional knack for presentations, and solid hackathon experience."
    },
    "700": {
        "name": "Bob Williams",
        "age": 35,
        "stack": ["JavaScript", "Node.js", "AWS"],
        "hackathon": 9,
        "work": "Fulltime",
        "direction": "devops",
        "video": 5,
        "presentation": 6,
        "introduction": "With a full-time devotion to tech, Bob's exceptional hackathon background and good video editing skills are complemented by his proficiency in DevOps."
    },
    "701": {
        "name": "Charlie Brown",
        "age": 17,
        "stack": ["HTML", "CSS", "JavaScript"],
        "hackathon": 3,
        "work": "high school",
        "direction": "frontend",
        "video": 7,
        "presentation": 5,
        "introduction": "A high school wiz, Charlie Brown couples a budding talent in front-end technologies with above-average video editing skills."
    },
    "702": {
        "name": "Diana Smith",
        "age": 29,
        "stack": ["Python", "Flask", "MongoDB"],
        "hackathon": 8,
        "work": "Fulltime",
        "direction": "fullstack",
        "video": 4,
        "presentation": 9,
        "introduction": "Diana, a full-time tech enthusiast, boasts an impressive track record in hackathons, superior presentation skills, and is not averse to a bit of video editing."
    },
    "703": {
        "name": "Eddie Miller",
        "age": 26,
        "stack": ["Java", "Spring Boot", "MySQL"],
        "hackathon": 8,
        "work": "Fulltime",
        "direction": "fullstack",
        "video": 3,
        "presentation": 7,
        "introduction": "Full-time professional Eddie offers a strong record in hackathons and effective presentation skills to any team lucky enough to have him."
    },
    "704": {
        "name": "Fiona Davis",
        "age": 19,
        "stack": ["JavaScript", "React", "Firebase"],
        "hackathon": 6,
        "work": "University",
        "direction": "frontend",
        "video": 8,
        "presentation": 7,
        "introduction": "Fiona, a creative university student, brings a passion for frontend development, excellent video editing capabilities, and commendable hackathon experience."
    },
    "705": {
        "name": "Gregory Thomas",
        "age": 32,
        "stack": ["Ruby", "Ruby on Rails", "PostgreSQL"],
        "hackathon": 9,
        "work": "Fulltime",
        "direction": "fullstack",
        "video": 2,
        "presentation": 9,
        "introduction": "Gregory, a seasoned full-time professional, pairs his full-stack expertise with impressive hackathon and presentation skills."
    },
    "706": {
        "name": "Helen Wilson",
        "age": 21,
        "stack": ["Python", "Django", "React"],
        "hackathon": 5,
        "work": "University",
        "direction": "fullstack",
        "video": 7,
        "presentation": 6,
        "introduction": "University student Helen combines her love for full-stack development with solid video editing skills and a promising hackathon background."
    },
    "707": {
        "name": "Ian Campbell",
        "age": 28,
        "stack": ["Java", "Spring", "MySQL"],
        "hackathon": 8,
        "work": "Fulltime",
        "direction": "fullstack",
        "video": 3,
        "presentation": 7,
        "introduction": "Full-stack developer Ian brings strong hackathon and presentation experience, making him a solid team asset."
    },
    "708": {
        "name": "Julia Collins",
        "age": 20,
        "stack": ["JavaScript", "React", "Firebase"],
        "hackathon": 6,
        "work": "University",
        "direction": "frontend",
        "video": 7,
        "presentation": 6,
        "introduction": "Frontend enthusiast Julia offers a potent mix of creative skills, hackathon experience, and strong presentation skills."
    },
    "709": {
        "name": "Keith Baker",
        "age": 31,
        "stack": ["C#", ".NET Core", "SQL Server"],
        "hackathon": 8,
        "work": "Fulltime",
        "direction": "fullstack",
        "video": 4,
        "presentation": 7,
        "introduction": "Full-stack developer Keith brings solid experience from multiple hackathons and impressive presentation skills."
    },
    "710": {
        "name": "Linda Davis",
        "age": 23,
        "stack": ["Python", "Flask", "MongoDB"],
        "hackathon": 7,
        "work": "University",
        "direction": "fullstack",
        "video": 6,
        "presentation": 7,
        "introduction": "Linda, a full-stack developer and university student, combines a strong tech stack with robust video editing and presentation skills."
    },
    "711": {
        "name": "Mike Evans",
        "age": 33,
        "stack": ["JavaScript", "Vue.js", "Node.js"],
        "hackathon": 9,
        "work": "Fulltime",
        "direction": "fullstack",
        "video": 3,
        "presentation": 8,
        "introduction": "Mike, a full-stack developer, pairs an impressive hackathon track record with solid presentation skills."
    },
    "712": {
        "name": "Nina Foster",
        "age": 22,
        "stack": ["HTML", "CSS", "JavaScript"],
        "hackathon": 5,
        "work": "University",
        "direction": "frontend",
        "video": 8,
        "presentation": 6,
        "introduction": "Nina, a passionate frontend developer at university, boasts solid hackathon experience and excellent video editing skills."
    },
    "713": {
        "name": "Oscar Garcia",
        "age": 36,
        "stack": ["Python", "Django", "React"],
        "hackathon": 9,
        "work": "Fulltime",
        "direction": "fullstack",
        "video": 4,
        "presentation": 7,
        "introduction": "Full-stack developer Oscar brings an impressive hackathon history, and is equally comfortable presenting and dabbling in video editing."
    },
    "714": {
        "name": "Patricia Harris",
        "age": 19,
        "stack": ["Swift", "Xcode", "Firebase"],
        "hackathon": 6,
        "work": "University",
        "direction": "other",
        "video": 7,
        "presentation": 7,
        "introduction": "Patricia, a dedicated university student, blends her mobile development skills with a knack for video editing and presentation."
    },
    "715": {
        "name": "Quincy Jackson",
        "age": 30,
        "stack": ["JavaScript", "Angular", "Node.js"],
        "hackathon": 8,
        "work": "Fulltime",
        "direction": "fullstack",
        "video": 4,
        "presentation": 9,
        "introduction": "Quincy, a seasoned full-stack developer, leverages his extensive hackathon and presentation experience to enhance team productivity."
    },
    "716": {
        "name": "Rachel King",
        "age": 24,
        "stack": ["Python", "TensorFlow", "Pandas"],
        "hackathon": 7,
        "work": "University",
        "direction": "other",
        "video": 5,
        "presentation": 7,
        "introduction": "Rachel, an enthusiastic AI specialist at university, couples her unique skill set with impressive presentation and moderate video editing skills."
    }

}

router = APIRouter(
    default_response_class = ORJSONResponse,
    tags = ["applications"],
)


@router.get("/")
async def start_conservation(auth: Auth):
    if not auth.is_authenticated():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    uid = auth.user_id

    user_application_messages[uid] = [{"role": "system", "content": """
You are an organizer of a hackathon. Attendees write to you to apply and find teammates. We need the following information from the people:
- Name
- Their stack (3 most important)
- Presentation skills
- Hackathon experience
- Age
- Current work or education type
- Video editing skills
If the user hasn't answered any of these ask back. Only ask for one piece of information at a time. Keep the answers as short as possible. If you have every information needed say goodbye in a few words, add <END_CONVERSATION> and end the message, wait for the next message.
If you get the <USER_STATS> message, you have to sum up for our system what you got to know in this json format:
{
"name": Name,
"age": Age, if the user doesn't give an exact age, try an approx value based on his answers,
"stack": [stack1, stack2, stack3],
"hackathon": Hackathon experience on a scale of 1-10 based on his answers,
"work": one of the following: Fulltime, high school, University,
"direction": one of the following: fullstack, frontend, devops, media, design, other, mostly based on the tech stack, but considering other answers too,
"video": Video editing experience on a scale of 1-10 based on his answers,
"presentation": Presentation skills on a scale of 1-10 based on his answers,
"introduction": Generate a 1 sentence long introduction based on the user's answers for this user, trying to convince other teams to choose his as a teammate. Don't include the exact stack into this
}
"""},
{"role": "assistant", "content": "What is your name?"}]
    
    return {
        "message": "What is your name?",
    }


class ApplyPost(BaseModel):
    message: str = ""

@router.post("/")
async def continue_conservation(
    auth: Auth,
    body: ApplyPost,
    background_tasks: BackgroundTasks,
):
    if not auth.is_authenticated():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    uid = auth.user_id

    print(user_application_messages)

    user_application_messages[uid].append({"role":"user", "content": body.message})

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=user_application_messages[uid],
        temperature=0.5,
        top_p=1,
    )

    print(response.choices[0].message.content)

    user_application_messages[uid].append({"role": "assistant", "content": response.choices[0].message.content})

    # if response contains <END_CONVERSATION> continue the conservation with the <USER_STATS> message
    if "<END_CONVERSATION>" in response.choices[0].message.content:
        print("Ending conservation")
        #background_tasks.add_task(generate_user_stats, uid)

    return {
        "message": response.choices[0].message.content,
    }

def generate_user_stats(uid: int):
    print("Generating user stats for user with id: " + str(uid))
    user_application_messages[uid].append({"role": "user", "content": """<USER_STATS>"""})
    print("szoszi1")
    print(user_application_messages[uid])
    try:
        profile_response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=user_application_messages[uid],
            temperature=0.5,
            top_p=1,
        )
    # print the error
    except Exception as e:
        print(e)
        return
    print(profile_response)
    print("szoszi2")

    user_application_messages[uid].append({"role": "assistant", "content": profile_response.choices[0].message.content})
    print("szoszi3")

    # convert the response to a dict and return it
    try:
        user_profiles[uid] = json.loads(profile_response.choices[0].message.content)
    except: print("somethings wrong with the response")

    print("User profile:")
    print(user_profiles[uid])

@router.get("/create_teams")
def create_teams():
    global team_recoms
    team_recoms = create_teams_first(user_profiles)

    print("Team recommendations:")
    print(team_recoms)

    return {
        "teams": team_recoms
    }
    
@router.get("/match")
def match_users_get(
    auth: Auth,
):
    print("Matching users")
    uid = 1
    if not auth.is_authenticated():
        uid = 1
        #raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    if uid != 1:
        uid = auth.user_id

    # find which team the user is in
    team_id, teammate_ids = find_team(uid, team_recoms)

    # collect data of the teammates
    teammates = []
    for teammate_id in teammate_ids:
        teammates.append({teammate_id: user_profiles[teammate_id]})

    # send the list of teammates to the user
    return {
        "teammates": teammates
    }

class MatchPost(BaseModel):
    targetUid: int = 0
    likes: bool = False
    uid: int = None
    
@router.post("/match")
def match_users_post(
    auth: Auth,
    body: MatchPost,
):
    if not body.uid:
        uid = 1
        if not auth.is_authenticated():
            uid = 1
            #raise HTTPException(status.HTTP_401_UNAUTHORIZED)

        if uid != 1:
            uid = auth.user_id

    else:
        uid = body.uid

    team_id, teammate_ids = find_team(uid, team_recoms)
    global liked_users, disliked_users

    if uid not in liked_users:
            liked_users[uid] = []

    if uid not in disliked_users:
        disliked_users[uid] = []

    if body.likes:
        # add the target user to the list of liked users
        liked_users[uid].append(body.targetUid)
    else:
        disliked_users[uid].append(body.targetUid)

    print(liked_users)
    print(disliked_users)

    # find the next user to match with
    new_team = modify_teams(team_recoms, disliked_users, user_profiles)

    print("New team recommendations:")
    print(new_team)
    print("Old team recommendations:")
    print(team_recoms)

def create_teams_first(user_data):
    video_experts = []
    presentation_experts = []
    others = []

    for id, user in user_data.items():
        user['id'] = id  # add the id into the dictionary for future use
        if user['video'] > 5:
            video_experts.append(user)
        elif user['presentation'] > 5:
            presentation_experts.append(user)
        else:
            others.append(user)

    # Sort users by age, work and hackathon experience
    video_experts.sort(key=lambda x: (x['age'], x['work'], x['hackathon']))
    presentation_experts.sort(key=lambda x: (x['age'], x['work'], x['hackathon']))
    others.sort(key=lambda x: (x['age'], x['work'], x['hackathon']))

    teams = []
    while len(video_experts) > 0 and len(presentation_experts) > 0:
        team = [video_experts.pop(0)['id'], presentation_experts.pop(0)['id']]

        while len(team) < 3 and len(others) > 0:
            team.append(others.pop(0)['id'])

        if len(team) == 3:
            teams.append(team)

    return teams

def fits_into_team(member, team, attendees):
    # Check diversity in age, work and hackathon experience
    age_difference = sum(abs(attendees[member]['age'] - attendees[teammate]['age']) for teammate in team)
    work_difference = sum(attendees[member]['work'] != attendees[teammate]['work'] for teammate in team)
    hackathon_difference = sum(abs(attendees[member]['hackathon'] - attendees[teammate]['hackathon']) for teammate in team)
    
    # We want teams to have low diversity in age, work and hackathon experience
    if age_difference / len(team) > 5 or work_difference > 0 or hackathon_difference / len(team) > 1:
        return False

    # Check diversity in stack and direction
    stack_difference = sum(set(attendees[member]['stack']) != set(attendees[teammate]['stack']) for teammate in team)
    direction_difference = sum(attendees[member]['direction'] != attendees[teammate]['direction'] for teammate in team)

    # We want teams to have high diversity in stack and direction
    if stack_difference == 0 or direction_difference == 0:
        return False

    return True

def find_team(uid, teams):
    print(teams, "teamssss")
    print(uid, "uid")
    for team_id, team in teams.items():
        if str(uid) in team:
            return team_id, [member for member in team if member != str(uid)]
    return None, None

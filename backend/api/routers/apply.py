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
    uid = 1

    if not auth.is_authenticated():
        uid = 1
        #raise HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    if uid != 1:
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
If the user hasn't answered any of these ask back. Only ask for one piece of information at a time. Keep the answers as short as possible. If you have every information needed close the conservation in a few words, add <END_CONVERSATION> and end the message, wait for the next message.
After this, if you get the <USER_STATS> message, you have to sum up for our system what you got to know in this json format:
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
    uid = 1
    if not auth.is_authenticated():
        uid = 1
        #raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    user_application_messages[uid].append({"role":"user", "content": body.message})

    if uid != 1:
        uid = auth.user_id

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
        background_tasks.add_task(generate_user_stats, uid)

    return {
        "message": response.choices[0].message.content,
    }

def generate_user_stats(uid: int):
    print("Generating user stats for user with id: " + str(uid))
    user_application_messages[uid].append({"role": "user", "content": """<USER_STATS>"""})
    profile_response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=user_application_messages[uid],
        temperature=0.5,
        top_p=1,
    )
    user_application_messages[uid].append({"role": "assistant", "content": profile_response.choices[0].message.content})

    # convert the response to a dict and return it
    try:
        user_profiles[uid] = json.loads(profile_response.choices[0].message.content)
    except: print("somethings wrong with the response")

    print("User profile:")
    print(user_profiles[uid])

@router.get("/create_teams")
def create_teams():
    global team_recoms
    team_recoms = create_teams(user_profiles)

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


def create_teams(attendees):
    # Sort the attendees by video and presentation skills
    sorted_by_video = sorted(attendees.items(), key=lambda item: item[1]['video'], reverse=True)
    sorted_by_presentation = sorted(attendees.items(), key=lambda item: item[1]['presentation'], reverse=True)

    # Allocate attendees to the video and presentation groups
    video = {}
    presentation = {}
    for attendee, details in sorted_by_video:
        if details['video'] > 5 and attendee not in presentation:
            video[attendee] = details
    for attendee, details in sorted_by_presentation:
        if details['presentation'] > 5 and attendee not in video:
            presentation[attendee] = details

    # Remaining attendees are those not in video or presentation groups
    remaining = {k: v for k, v in attendees.items() if k not in video and k not in presentation}

    teams = defaultdict(list)

    # Add one person with video editing skills and one with presentation skills to each team
    video_keys = list(video.keys())
    presentation_keys = list(presentation.keys())
    random.shuffle(video_keys)
    random.shuffle(presentation_keys)

    for i in range(min(len(video_keys), len(presentation_keys))):
        teams[i].append(video_keys[i])
        teams[i].append(presentation_keys[i])

    remaining_keys = list(remaining.keys())
    random.shuffle(remaining_keys)

    # Make sure every team has at least 3 members
    for i in range(len(teams)):
        while len(teams[i]) < 3 and remaining_keys:  # Check if 'remaining_keys' is not empty
            teams[i].append(remaining_keys.pop())

    # Try to add each of the remaining candidates to a team that will minimize diversity in age, work and hackathon experience
    for key in remaining_keys:
        candidate = remaining[key]
        min_difference = float('inf')
        min_team = None
        for team_key, team in teams.items():
            if len(team) >= 5:
                continue
            age_difference = sum(abs(candidate['age'] - attendees[member]['age']) for member in team)
            work_difference = sum(candidate['work'] != attendees[member]['work'] for member in team)
            hackathon_difference = sum(abs(candidate['hackathon'] - attendees[member]['hackathon']) for member in team)
            total_difference = age_difference + work_difference + hackathon_difference
            if total_difference < min_difference:
                min_difference = total_difference
                min_team = team_key
        if min_team is not None:
            teams[min_team].append(key)

    return dict(teams)    

def modify_teams(teams, dislikes, attendees):
    # Copy of the teams to iterate over while modifying the original teams
    teams_copy = teams.copy()

    for team_id, team in teams_copy.items():
        for member_id in team:
            # Check if member has dislikes in the current team
            if member_id in dislikes:
                for disliked_member_id in dislikes[member_id]:
                    # If a disliked member is in the same team, try to find a new team
                    if disliked_member_id in team:
                        for other_team_id, other_team in teams.items():
                            # Don't move to the current team and check if there's space in the other team
                            if team_id != other_team_id and len(other_team) < 5:
                                # Check if the member fits into the other team
                                if fits_into_team(member_id, other_team, attendees):
                                    # Move the member to the other team
                                    team.remove(member_id)
                                    teams[other_team_id].append(member_id)
                                    # Break out of the loop since the member has been moved
                                    break
                        # Break out of the loop since the member has been moved
                        break
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

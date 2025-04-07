# Nextech Code Challenge - Cole 
Thank you for taking the time to review this code! I honestly enjoyed this code test when compared to most others, as it actually felt like a real world scenario. Please feel free to reach out with any suggestions, I would love to hear them.
## Running Application
- I used Visual Studio to build this, and just hitting start was enough. If not, check the startup project and make sure it is Nextech.Server
- I ran into an issue when developing this, that I could not figure out why this occured. I believe it has to do with Microsoft's project template
  - If you debug the app and then stop the run, a command terminal stays open. If you try to run the app again it'll fail, but if you make sure to close all command terminals first it should be fine.

 ## Unit Tests
 - To run C# unit tests I used the VS Test Explorer. To run the angular tests I just ran the normal `ng test`. I made the C# tests in their own project, Nextech.Server.Test.
### Code Coverage
C#:

![image](https://github.com/user-attachments/assets/a32981e6-94eb-4cce-b7c7-540548dca81c)

Angular:

![image](https://github.com/user-attachments/assets/d5edc153-20de-402a-9094-bb3e9ea1c314)

## About the Code
- I used a typical API Controller for this as my only real C# class for simplicity. If this was a 'real' project I would do things like appsettings for constants and urls, etc.
- For the front end, I build my own pagination as using a design system like Material felt like cheating. The only things I used externally are Bootstrap for styling and ngx-spinner for a loading spinner.
- Searching is based off of both URL and Title, so if you search a string and a result doesn't seem right, it is the URL that caused it to return.
### Complications/Thought Process
- The biggest complication I had was that the Microsoft Angular/Web API template was broken for my controller. The proxy would not redirect, and that honestly took me the majority of the time with this project.
- Workflow wise, the biggest issue I found was that the Hacker News API to my knowledge did not allow for getting multiple full records at once. This meant the initial call was pretty slow as I had to get all records by id individually
  - For this reason, I decided to use a lazy loading approach and every page change was a call to the contoller. With caching implemented this did not cause calls to be slow that I noticed.
  - I thought about caching each page seperately so you could just pull a whole page from the cache without getting all of them and then doing .Skip().Take(), but with searching by text involved that didn't seem right.

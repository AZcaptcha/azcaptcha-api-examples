public byte[] GetCaptchaImage() //get captcha image url
        {
            //load Steam page
            _client.BaseUrl = JoinUri;
            _request.Method = Method.GET;
            var response = _client.Execute(_request);

            //Store captcha ID
            _captchaGid = CaptchaRegex.Matches(response.Content)[0].Groups[1].Value;

            //download and return captcha image
            _client.BaseUrl = new Uri(CaptchaUri + _captchaGid);
            var captchaResponse = _client.DownloadData(_request);
            return captchaResponse;
        }
		
		
		
        public static String gethtmlform(string Url) //htmlform
        {

            HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(Url);
            myRequest.Method = "GET";
            WebResponse myResponse = myRequest.GetResponse();
            StreamReader sr = new StreamReader(myResponse.GetResponseStream(), System.Text.Encoding.UTF8);
            string result = sr.ReadToEnd();
            sr.Close();
            myResponse.Close();

            return result;
        }
		
 
        public string captcharesult()  //captcharesult
        {
            //POST
            try
            {
                System.Net.ServicePointManager.Expect100Continue = false;
                var request = (HttpWebRequest)WebRequest.Create("http://azcaptcha.com/in.php");
                string base64string = Convert.ToBase64String(GetCaptchaImage());
                var postData = "method=base64&key=" + key + "&body=" + WebUtility.UrlEncode(base64string); 
 
                var data = Encoding.ASCII.GetBytes(postData);

                request.Method = "POST";

                request.ContentType = "application/x-www-form-urlencoded";
                request.ContentLength = data.Length;

                using (var stream = request.GetRequestStream())
                {
                    stream.Write(data, 0, data.Length);
                }

                var response = (HttpWebResponse)request.GetResponse();

                string responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                if(responseString.Contains("OK|"))
                {
			      //  GET
                    string captcha = "";
                     
                    while (true)
                    {
                        captcha = gethtmlform("http://azcaptcha.com/res.php?key=" + key + "&action=get&id=" + responseString.Split('|')[1]);
                        if(captcha == "CAPCHA_NOT_READY")
                        {
                            System.Threading.Thread.Sleep(5000);
                            continue;
                        }
                        if (captcha == "_")
                        {
                            System.Threading.Thread.Sleep(5000);
                            continue;
                        }
                       
                        if (captcha.Contains("OK|"))
                        {
                            captcha = captcha.Replace("OK|", "");
                            
                        }
                        return captcha;

                    }
                }
                return "";

               
               
            }
            catch (Exception e)
            {
                string tt = e.Message;
                return tt;
            }

        }

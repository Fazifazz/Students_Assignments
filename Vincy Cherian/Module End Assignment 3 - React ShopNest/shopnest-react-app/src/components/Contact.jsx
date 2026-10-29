function Contact(){
    return (
        <>
        <h3 className="Contact-head">Contact Us</h3> 
<div className="Contact-dtl">
        <h4>We're Here to Help</h4>
<div> At ShopNest, your shopping experience matters to us. Whether you have a question about a product, need help with an order, or require assistance with delivery, returns, or payments, we're happy to help.
</div>
<div>Our customer support team is here to make your shopping experience simple, smooth, and enjoyable. </div>
<br/><br/>
 <h4>Get in Touch</h4>
<h5>ShopNest Customer Support</h5>

<div>
    📍 Address  <br/>
    123 Market Street, Kochi, Kerala – 682001, India <br/>
    <br/>
    📞 Phone <br/> 
    +91 98765 43210 <br/>
    <br/>
    ✉️ Email  <br/>
    support@shopnest.com <br/>
    <br/>
    🕒 Customer Support Hours  <br/>
    Monday – Saturday: 9:00 AM – 6:00 PM  <br/>
    Sunday and public holidays: Closed <br/><br/><br/>
</div>

<h4>How Can We Help You?</h4>

<div>You can contact us for assistance with: <br/>
- Product information and availability  <br/>
- Order status and delivery updates  <br/>
- Payments and billing enquiries  <br/>
- Returns, refunds, and exchanges  <br/>
- Account-related issues  <br/>
- Feedback and suggestions  <br/>
</div>
<br/>

<h4> Send Us a Message </h4>

<div>
Have a question or need assistance? Fill out our contact form with your details and a brief description of your enquiry.<br/> Our team will review your message and get back to you as soon as possible.
</div> 
<br/>

<table >
    <tbody>
        <tr>
            <th><label htmlFor="fullName">Full Name</label></th>
            <td><input type="text" name="fullName" id="fullName" /></td>
        </tr>

        <tr>
            <th><label htmlFor="emailAddress">Email Address</label></th>
            <td><input type="email" name="emailAddress" id="emailAddress" /></td>
        </tr>

        <tr>
            <th><label htmlFor="phNumber">Contact number</label></th>
            <td><input type="text" name="phNumber" id="phNumber" /></td>
        </tr>

        <tr>
            <th><label htmlFor="subject">Subject</label></th>
            <td><input type="text" name="subject" id="subject" /></td>
        </tr>

        <tr>
            <th><label htmlFor="message">Message</label></th>
            <td> <textarea id="message" name="message" rows="5" placeholder="Enter your message" required/></td>
        </tr>

        <tr>
            <td></td>
            <td><br/><button className="btn btn-primary" type="submit" name="submitBtn">Submit</button></td>
        </tr>
    </tbody>
</table>


<br/><br/>
<div>Thank you for choosing ShopNest.</div>
<br/>
<div><i>Shop Smart. Live Better.</i></div>
</div>
</>
    )
}

export default Contact
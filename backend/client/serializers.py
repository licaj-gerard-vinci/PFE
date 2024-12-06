from rest_framework import serializers
from .models import Client, Template

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    id_template = TemplateSerializer()

    class Meta:
        model = Client
        fields = '__all__'